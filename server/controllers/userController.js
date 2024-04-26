const { client } = require('../config/redis')
const axios = require('axios')
const { connection } = require('../config/mysql')

const fetchWatchlist = (req, res) => {
    const { username } = req.user;
    const query = `
      SELECT w.id, w.stock_symbol
      FROM users u
      JOIN watchlist w ON u.id = w.user_id
      WHERE u.username = ?
    `;
    connection.query(query, [username], async (err, results) => {
      if (err) {
        console.error("Error fetching watchlist:", err);
        return res.status(500).json({ message: "Error fetching watchlist" });
      }
      const stockDetailsPromises = results.map((portfolioItem) => {
        const url = `https://financialmodelingprep.com/api/v3/profile/${portfolioItem.stock_symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`;
        return axios.get(url).then((response) => ({
          ...portfolioItem,
          stockDetails: response.data,
        }));
      });
      const watchListWithDetails = await Promise.all(stockDetailsPromises);
      res.json(watchListWithDetails);
    });
}
const updateBuyPrice = async (req, res) => {
    const {numberOfShares, purchaseDate, purchaseTime, symbol} = req.query
    try {
      const url = `https://financialmodelingprep.com/api/v3/historical-chart/1min/${symbol}?from=${purchaseDate}&to=${purchaseDate}&apikey=${process.env.STOCK_PRIVATE_KEY}`
      const response = await axios.get(url)
      const specificDate = `${purchaseDate} ${purchaseTime}:00`;
      const entry = response.data.find(item => item.date === specificDate);
      const returnValue = Number(numberOfShares)*Number(entry.low)
      res.json(returnValue);
    } catch(e) {
      console.log(e)
    }
}

module.exports = { updateBuyPrice, fetchWatchlist }