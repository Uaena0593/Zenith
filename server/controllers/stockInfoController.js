const { client } = require('../config/redis')
const axios = require('axios')
const { connection } = require('../config/mysql')

const queryStockInfo = async (req, res) => {
    const { queryStockValue } = req.query;
  
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/profile/${queryStockValue}?apikey=${process.env.STOCK_PRIVATE_KEY}`
      );
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      console.error("error while fetching data", error);
      res.status(500).send("failed to fetch data");
    }
}

const queryStockData = async (req, res) => {
    const { queryStockValue } = req.query;
    const url = `https://financialmodelingprep.com/api/v3/search?query=${queryStockValue}&exchange=NASDAQ&apikey=${process.env.STOCK_PRIVATE_KEY}`;
  
    try {
      const searchResponse = await axios.get(url);
      if (searchResponse.data && searchResponse.data.length > 0) {
        const profileRequests = searchResponse.data.map((stock) =>
          axios.get(
            `https://financialmodelingprep.com/api/v3/profile/${stock.symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`
          )
        );
        const profileResponses = await Promise.all(profileRequests);
        const profileData = profileResponses.map((response) => response.data);
        res.send(profileData);
      } else {
        res.send([]);
      }
    } catch (error) {
      console.error("error while fetching data", error);
      res.status(500).send("failed to fetch data");
    }
  }

const fetchStockChart = async (req, res)=> {
    const { queryStockSymbol } = req.query
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const lastDate = today.toISOString().substring(0, 10);
      const firstDate = thirtyDaysAgo.toISOString().substring(0, 10);
      const datesArray = [];
  
      for (let currentDate = new Date(thirtyDaysAgo); currentDate <= today; currentDate.setDate(currentDate.getDate() + 1)) {
        datesArray.push({
          date: currentDate.toISOString().substring(0, 10),
          value: 0
        });
      }
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${queryStockSymbol}?from=${firstDate}&to=${lastDate}&apikey=${process.env.STOCK_PRIVATE_KEY}`)
      const data = response.data.historical;
      console.log(data)
      datesArray.forEach(dataItem => {
        const matchingStock = data.find(stockItem => stockItem.date === dataItem.date);
        if (matchingStock) {
          dataItem.value = matchingStock.open
          dataItem.value = Number(dataItem.value.toFixed(2));
        }
      });
      let firstNonZeroValue = null;
  
      for (let dataItem of datesArray) {
        if (dataItem.value !== 0) {
          firstNonZeroValue = dataItem.value;
          break;
        }
      }
  
      if (firstNonZeroValue !== null) {
        for (let dataItem of datesArray) {
          if (dataItem.value === 0) {
            dataItem.value = firstNonZeroValue;
          } else {
            break;
          }
        }
      }
  
      let lastNonZeroValue = firstNonZeroValue;
  
      for (let dataItem of datesArray) {
        if (dataItem.value === 0) {
          dataItem.value = lastNonZeroValue;
        } else {
          lastNonZeroValue = dataItem.value;
        }
      }
      res.json(datesArray)
    } catch(e) {
      console.log(e)
    }
}

module.exports = { fetchStockChart, queryStockInfo, queryStockData }