# Investment Portfolio (Zenith)
![image](https://github.com/Uaena0593/investment-portfolio-zenith/assets/86070045/6178300e-9991-4910-9b0f-33e07659ce7e)

# My Project
- Allows users to create an investment portfolio which reflects their actual investment account on another platform (ex. Coinbase, Questrade, etc.)
- Uses Recharts to display data of user portfolios or of individual stocks.
- Implments OAuth2.0 and JWT for authentication and security.

## Tech Stack
- Next.js
- React (Typescript)
- Express
- Node.js
- MySQL
- Redis

# Project Walkthrough
![Create Next App (1)](https://github.com/Uaena0593/investment-portfolio-zenith/assets/86070045/42b39230-0ddb-4710-b625-1245b08cba50)
- Register using token authentication here.
- Directs you to landing page where the data for your investment portfolio.


![Create-Next-App-_2_](https://github.com/Uaena0593/investment-portfolio-zenith/assets/86070045/78930283-d160-4c61-8543-0a4845ca1628)
- Search for a stock using a symbol or company name.
  

![Create-Next-App-_3_](https://github.com/Uaena0593/investment-portfolio-zenith/assets/86070045/1678da4f-33c5-42f7-938c-0e7b9c1b1f6b) 

-  Add a specific stock while specifying how many shares you want, the date purchased, and the time purchased.
-  Given an option whether you want to add it to the watchlist.


## Running Locally
open terminal 
- cd btc-wallet
- npm i
- npm run dev

open another terminal
- cd server
- npm i 
- npm run dev

## Future Goals
- Allow sharing and display
- Full deployment on a server

## past here is the technical portion of the project if interested
## Server Side Cache
To enhance efficiency of the webpage and reduce the latency during page loads, I implemented server-side caching using Redis. This was able to address the delays caused by frequent requests to the public REST API for live stock data. With the cache, I was able to minimize the rate of outgoing requests.
- Note: Caching was done server sided for the individual stocks, so if different users had the same investments, their data would be requested faster. However the same was done for the personal investment portfolio data, which should be stored locally (future change).
