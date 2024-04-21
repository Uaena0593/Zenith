const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql');
const redis = require('redis')
const cookieParser = require('cookie-parser');
const { fetchPortfolioData } = require('./services/graphData')
const { registerRoute, loginRoute, authenticateToken } = require('./authentication/authRoutes');
const { authenticateTokenMiddleware } = require('./middleware/auth/authMiddleware')

const app = express();
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

app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser());

const PORT = 8000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE_CONNECTION_PW,
    database: 'btcwallet'
});
app.get('/check-portfolio', authenticateTokenMiddleware, async (req,res) => {
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
    } catch (e) {
      console.log(e)
    }

})

app.get('/fetch-stock-chart', authenticateTokenMiddleware, async (req, res)=> {
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
})

app.get('/fetch-myportfolio-data', authenticateTokenMiddleware, fetchPortfolioData);

app.get('/update-buy-price', async (req, res) => {
  const {numberOfShares, purchaseDate, purchaseTime, symbol} = req.query
  try {
    const url = `https://financialmodelingprep.com/api/v3/historical-chart/1min/${symbol}?from=${purchaseDate}&to=${purchaseDate}&apikey=${process.env.STOCK_PRIVATE_KEY}`
    const response = await axios.get(url)
    const specificDate = `${purchaseDate} ${purchaseTime}:00`;
    const entry = response.data.find(item => item.date === specificDate);
    console.log(entry.low)
    console.log('working')
    const pogger = Number(numberOfShares)
    const pogger1 = Number(entry.low)
    const returnValue = pogger1*pogger
    res.json(returnValue);
  } catch(e) {
    console.log(e)
  }
})


app.get('/add-to-portfolio', authenticateTokenMiddleware, async (req, res) => {
  const { username } = req.user;
  const { numberOfShares, purchaseDate, purchaseTime, symbol, addToWatchlist } = req.query;
 
  const url = `https://financialmodelingprep.com/api/v3/historical-chart/1min/${symbol}?from=${purchaseDate}&to=${purchaseDate}&apikey=${process.env.STOCK_PRIVATE_KEY}`
  const response = await axios.get(url)
  const specificDate = `${purchaseDate} ${purchaseTime}:00`;
  const entry = response.data.find(item => item.date === specificDate);
  if (!entry) {
    return res.status(404).json({ message: 'No stock data found for the specified date and time' });
  }

  const userIdQuery = 'SELECT id FROM users WHERE username = ?';
  connection.query(userIdQuery, [username], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'An error occurred' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      const userId = results[0].id;
      if (addToWatchlist) {
        const checkWatchlistQuery = 'SELECT 1 FROM watchlist WHERE user_id = ? AND stock_symbol = ?';
        connection.query(checkWatchlistQuery, [userId, symbol], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'An error occurred while checking the watchlist' });
          }
          if (results.length === 0) {
            const addWatchlistQuery = 'INSERT INTO watchlist (user_id, stock_symbol) VALUES (?, ?)';
            connection.query(addWatchlistQuery, [userId, symbol], (err, results) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'An error occurred during watchlist update' });
              }
            });
          }
          updatePortfolio(userId, symbol, purchaseDate, purchaseTime, entry.low, numberOfShares, res);
        });
      } else {
        updatePortfolio(userId, symbol, purchaseDate, purchaseTime, entry.low, numberOfShares, res);
      }
  });
});

function updatePortfolio(userId, symbol, purchaseDate, purchaseTime, buyPrice, numberOfShares, res) {
  const insertQuery = `
      INSERT INTO portfolio (user_id, stock_symbol, purchase_date, purchase_time, buy_price, shares)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  connection.query(insertQuery, [userId, symbol, purchaseDate, purchaseTime, buyPrice, numberOfShares], (err, insertResult) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'An error occurred during portfolio update' });
      }
      res.status(200).json({ message: 'Portfolio updated successfully' });
  });
}



app.get('/fetch-watchlist', authenticateTokenMiddleware, (req, res) => {
  const { username } = req.user;
  const query = `
    SELECT w.id, w.stock_symbol
    FROM users u
    JOIN watchlist w ON u.id = w.user_id
    WHERE u.username = ?
  `;
  
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error fetching watchlist:', err);
      return res.status(500).json({ message: 'Error fetching watchlist' });
    }
    const stockDetailsPromises = results.map((portfolioItem) => {
      const url = `https://financialmodelingprep.com/api/v3/profile/${portfolioItem.stock_symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`;
      return axios.get(url).then(response => ({
        ...portfolioItem,
        stockDetails: response.data
      }));
    });
    const watchListWithDetails = await Promise.all(stockDetailsPromises);
    res.json(watchListWithDetails);
  });
});


app.get('/fetch-portfolio', authenticateTokenMiddleware, async (req, res) => {
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
        console.error('Error fetching portfolio:', err);
        return res.status(500).json({ message: 'Error fetching portfolio' });
      }

      const stockDetailsPromises = results.map((portfolioItem) => {
        const url = `https://financialmodelingprep.com/api/v3/profile/${portfolioItem.stock_symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`;
        return axios.get(url).then(response => ({
          ...portfolioItem,
          stockDetails: response.data
        }));
      });

      const portfolioWithDetails = await Promise.all(stockDetailsPromises);

      res.json(portfolioWithDetails);
    });
  } catch (error) {
    console.error('Error processing portfolio:', error);
    res.status(500).json({ message: 'Error processing portfolio' });
  }
});


app.get('/query-stock-information', async (req, res) => {
  const { queryStockValue } = req.query;

  try {
    const response =  await  axios.get(`https://financialmodelingprep.com/api/v3/profile/${queryStockValue}?apikey=${process.env.STOCK_PRIVATE_KEY}`)
    console.log(response.data)
    res.json(response.data)
  } catch (error) {
    console.error('error while fetching data', error);
    res.status(500).send('failed to fetch data');
  }
});

app.get('/query-stock-data', async (req, res) => {
  const { queryStockValue } = req.query;
  const url = `https://financialmodelingprep.com/api/v3/search?query=${queryStockValue}&exchange=NASDAQ&apikey=${process.env.STOCK_PRIVATE_KEY}`;

  try {
    const searchResponse = await axios.get(url);
    if (searchResponse.data && searchResponse.data.length > 0) {
      const profileRequests = searchResponse.data.map(stock => 
        axios.get(`https://financialmodelingprep.com/api/v3/profile/${stock.symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`)
      );
      const profileResponses = await Promise.all(profileRequests);
      const profileData = profileResponses.map(response => response.data);
      res.send(profileData);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.error('error while fetching data', error);
    res.status(500).send('failed to fetch data');
  }
});
app.get('/get-symbol-information', async(req,res)=>{
  const { symbol } = req.query
  const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`
  try {
    const response = await axios.get(url)
  }catch (e) {
    console.log(e)
  }

})

app.post('/register', registerRoute);

app.post('/login', loginRoute);

app.get('/authenticateToken', authenticateToken);

app.get('/protected-route', authenticateToken, (req, res) => {
    res.status('This is a protected route');
});

app.get('/logout', async (req, res) => {
  res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'strict' });
  res.send('Logged out');
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});


app.get('/recovery', async (req, res) => {
    try{
        const { passphrase } = req.query;
        var code = new Mnemonic();
        var mnemonic_code = code.toString();
        console.log(mnemonic_code);

        var xpriv;
        if (passphrase) {
            xpriv = code.toHDPrivateKey(passphrase);
        } else {
            xpriv = code.toHDPrivateKey();
        }
        res.json({ mnemonic: mnemonic_code, xpriv });
    } catch(error){
        console.log(error)
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
