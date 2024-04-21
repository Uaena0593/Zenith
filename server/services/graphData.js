const mysql = require('mysql');
const redis = require('redis')
const axios = require('axios')
require('dotenv').config();

const client = redis.createClient({
  host: 'localhost',
  port: 8000
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DATABASE_CONNECTION_PW,
  database: 'btcwallet'
});

const fetchPortfolioData = async (req, res) => {
  try {
      const users = await new Promise((resolve, reject) => {
          const userQuery = `SELECT id FROM users WHERE username = ?`;
          connection.query(userQuery, [req.user.username], (err, results) => {
              if (err) return reject(err);
              resolve(results);
          });
      });

      if (users.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      const user = users[0];
      const portfolio = await new Promise((resolve, reject) => {
          const portfolioQuery = `SELECT stock_symbol, shares FROM portfolio WHERE user_id = ?`;
          connection.query(portfolioQuery, [user.id], (err, results) => {
              if (err) return reject(err);
              resolve(results);
          });
      });

      if (portfolio.length === 0) {
          return res.status(404).json({ message: 'Portfolio not found' });
      }

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

      const stockDataPromises = portfolio.map(async stock => {
          const cacheKey = `stock_data:${stock.stock_symbol}:${firstDate}:${lastDate}`;
          let cachedData = await client.hGetAll(cacheKey);

          if (Object.keys(cachedData).length === 0) {
              const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${stock.stock_symbol}?from=${firstDate}&to=${lastDate}&apikey=${process.env.STOCK_PRIVATE_KEY}`);
              const data = response.data.historical;
              let cacheData = {};
              data.forEach(stockItem => {
                  cacheData[stockItem.date] = stockItem.open;
                  const matchingDate = datesArray.find(dateItem => dateItem.date === stockItem.date);
                  if (matchingDate) {
                      matchingDate.value += (stockItem.open * stock.shares);
                      matchingDate.value = Number(matchingDate.value.toFixed(2));
                  }
              });
              await client.hSet(cacheKey, cacheData);
          } else {
              datesArray.forEach(dateItem => {
                  const stockPrice = cachedData[dateItem.date];
                  if (stockPrice) {
                      dateItem.value += (parseFloat(stockPrice) * stock.shares);
                      dateItem.value = Number(dateItem.value.toFixed(2));
                  }
              });
          }
      });

      await Promise.all(stockDataPromises);
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
      console.log(datesArray);
      client.get('NFLX', (err, reply) => {
        console.log(reply); // prints the value of 'mykey'
    });
      res.json(datesArray);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    }
  };

module.exports = { fetchPortfolioData }