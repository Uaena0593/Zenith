const { client } = require("../config/redis");
const axios = require("axios");
const { connection } = require("../config/mysql");

function updatePortfolio(
  userId,
  symbol,
  purchaseDate,
  purchaseTime,
  buyPrice,
  numberOfShares,
  res
) {
  const insertQuery = `
        INSERT INTO portfolio (user_id, stock_symbol, purchase_date, purchase_time, buy_price, shares)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
  connection.query(
    insertQuery,
    [userId, symbol, purchaseDate, purchaseTime, buyPrice, numberOfShares],
    (err, insertResult) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "An error occurred during portfolio update" });
      }
      res.status(200).json({ message: "Portfolio updated successfully" });
    }
  );
}
const fetchPortfolio = async (req, res) => {
    const { username } = req.user;
    const query = `
      SELECT p.id, p.stock_symbol, p.purchase_date, p.purchase_time, p.buy_price, p.shares
      FROM users u
      JOIN portfolio p ON u.id = p.user_id
      WHERE u.username = ?
    `;
  
    try {
      connection.query(query, [username], async (err, results) => {
        if (err) {
          console.error("Error fetching portfolio:", err);
          return res.status(500).json({ message: "Error fetching portfolio" });
        }
  
        const stockDetailsPromises = results.map((portfolioItem) => {
          const url = `https://financialmodelingprep.com/api/v3/profile/${portfolioItem.stock_symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`;
          return axios.get(url).then((response) => ({
            ...portfolioItem,
            stockDetails: response.data,
          }));
        });
  
        const portfolioWithDetails = await Promise.all(stockDetailsPromises);
  
        res.json(portfolioWithDetails);
      });
    } catch (error) {
      console.error("Error processing portfolio:", error);
      res.status(500).json({ message: "Error processing portfolio" });
    }
}

const checkPortfolioExist = async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      const userQuery = `SELECT id FROM users WHERE username = ?`;
      connection.query(userQuery, [req.user.username], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
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
      return res.status(404).json({ message: "Portfolio not found" });
    }
  } catch (e) {
    console.log(e);
  }
};

const addToPortfolio = async (req, res) => {
  const { username } = req.user;
  const { numberOfShares, purchaseDate, purchaseTime, symbol, addToWatchlist } =
    req.query;

  const url = `https://financialmodelingprep.com/api/v3/historical-chart/1min/${symbol}?from=${purchaseDate}&to=${purchaseDate}&apikey=${process.env.STOCK_PRIVATE_KEY}`;
  const response = await axios.get(url);
  const specificDate = `${purchaseDate} ${purchaseTime}:00`;
  const entry = response.data.find((item) => item.date === specificDate);
  if (!entry) {
    return res
      .status(404)
      .json({ message: "No stock data found for the specified date and time" });
  }

  const userIdQuery = "SELECT id FROM users WHERE username = ?";
  connection.query(userIdQuery, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = results[0].id;
    if (addToWatchlist) {
      const checkWatchlistQuery =
        "SELECT 1 FROM watchlist WHERE user_id = ? AND stock_symbol = ?";
      connection.query(
        checkWatchlistQuery,
        [userId, symbol],
        (err, results) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({
                message: "An error occurred while checking the watchlist",
              });
          }
          if (results.length === 0) {
            const addWatchlistQuery =
              "INSERT INTO watchlist (user_id, stock_symbol) VALUES (?, ?)";
            connection.query(
              addWatchlistQuery,
              [userId, symbol],
              (err, results) => {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .json({
                      message: "An error occurred during watchlist update",
                    });
                }
              }
            );
          }
          updatePortfolio(
            userId,
            symbol,
            purchaseDate,
            purchaseTime,
            entry.low,
            numberOfShares,
            res
          );
        }
      );
    } else {
      updatePortfolio(
        userId,
        symbol,
        purchaseDate,
        purchaseTime,
        entry.low,
        numberOfShares,
        res
      );
    }
  });
};

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
      return res.status(404).json({ message: "User not found" });
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
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const lastDate = today.toISOString().substring(0, 10);
    const firstDate = thirtyDaysAgo.toISOString().substring(0, 10);
    const datesArray = [];

    for (
      let currentDate = new Date(thirtyDaysAgo);
      currentDate <= today;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      datesArray.push({
        date: currentDate.toISOString().substring(0, 10),
        value: 0,
      });
    }

    const stockDataPromises = portfolio.map(async (stock) => {
      const cacheKey = `stock_data:${stock.stock_symbol}:${firstDate}:${lastDate}`;
      let cachedData = await client.hGetAll(cacheKey);

      if (Object.keys(cachedData).length === 0) {
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/historical-price-full/${stock.stock_symbol}?from=${firstDate}&to=${lastDate}&apikey=${process.env.STOCK_PRIVATE_KEY}`
        );
        const data = response.data.historical;
        let cacheData = {};
        data.forEach((stockItem) => {
          cacheData[stockItem.date] = stockItem.open;
          const matchingDate = datesArray.find(
            (dateItem) => dateItem.date === stockItem.date
          );
          if (matchingDate) {
            matchingDate.value += stockItem.open * stock.shares;
            matchingDate.value = Number(matchingDate.value.toFixed(2));
          }
        });
        await client.hSet(cacheKey, cacheData);
      } else {
        datesArray.forEach((dateItem) => {
          const stockPrice = cachedData[dateItem.date];
          if (stockPrice) {
            dateItem.value += parseFloat(stockPrice) * stock.shares;
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
    client.get("NFLX", (err, reply) => {
      console.log(reply); // prints the value of 'mykey'
    });
    res.json(datesArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};

module.exports = { fetchPortfolioData, checkPortfolioExist, addToPortfolio, fetchPortfolio };
