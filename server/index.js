const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const {
  fetchPortfolioData,
  checkPortfolioExist,
  addToPortfolio,
  fetchPortfolio
} = require("./controllers/portfolioController");
const { fetchStockChart, queryStockInfo, queryStockData } = require("./controllers/stockInfoController");
const { updateBuyPrice, fetchWatchlist } = require("./controllers/userController");
const {
  registerRoute,
  loginRoute,
  authenticateToken,
  logout
} = require("./authentication/authRoutes");
const { authenticateTokenMiddleware } = require("./middleware/authMiddleware");
const { client } = require("./config/redis");

const app = express();
require("dotenv").config();

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

const PORT = 8000;



//checks if portfolio is empty and then displays the default text if so
app.get("/check-portfolio", authenticateTokenMiddleware, checkPortfolioExist);

//fetches the data for the stock chart
app.get("/fetch-stock-chart", authenticateTokenMiddleware, fetchStockChart);

//fetches the user's portfolio data
app.get(
  "/fetch-myportfolio-data",
  authenticateTokenMiddleware,
  fetchPortfolioData
);

//updates the buy price at the add investment page
app.get("/update-buy-price", updateBuyPrice);

app.get("/add-to-portfolio", authenticateTokenMiddleware, addToPortfolio);

app.get("/fetch-watchlist", authenticateTokenMiddleware, fetchWatchlist);

app.get("/fetch-portfolio", authenticateTokenMiddleware, fetchPortfolio);

app.get("/query-stock-information", queryStockInfo);

app.get("/query-stock-data", queryStockData);
app.get("/get-symbol-information", async (req, res) => {
  const { symbol } = req.query;
  const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.STOCK_PRIVATE_KEY}`;
  try {
    const response = await axios.get(url);
  } catch (e) {
    console.log(e);
  }
});

app.post("/register", registerRoute);

app.post("/login", loginRoute);

app.get("/authenticateToken", authenticateToken);

app.get("/protected-route", authenticateToken, (req, res) => {
  res.status("This is a protected route");
});

app.get("/logout", logout);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
