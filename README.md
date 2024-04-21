# Investment Portfolio (Zenith)
![image](https://github.com/Uaena0593/investment-portfolio-zenith/assets/86070045/7d8ce251-27dd-41b9-a50f-aae10e7f1e81)
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
- Allow sharing 

## past here is the technical portion of the project if interested
## Server Side Cache
To enhance efficiency of the webpage and reduce the latency during page loads, I implemented server-side caching using Redis. This was able to address the delays caused by frequent requests to the public REST API for live stock data. With the cache, I was able to minimize the rate of outgoing requests.
- Note: Caching was done server sided for the individual stocks, so if different users had the same investments, their data would be requested faster. However the same was done for the personal investment portfolio data, which should be stored locally (future change).
