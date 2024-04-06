import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyPortfolio = () => {
  const [stockPortfolio, setStockPortfolio] = useState([])
  useEffect(() => {
    const fetchPortfolio = async() => {
      const response = await axios.get("http://localhost:8000/fetch-portfolio", { withCredentials: true })
      console.log(response.data)
      setStockPortfolio(response.data)
    }
    fetchPortfolio()
  },[])
  return (
    <>
      <section>
        {stockPortfolio.map((item, index) => (
          <div
            key={index}
            className="flex flex-row mb-2 bg-white space-x-2 h-16 search-result border border-grey-400 rounded-xl px-8 items-center justify-between"
          >
            <div >{item.stock_symbol}</div>
            <div>buy price: {item.buy_price}</div>
            <div>shares bought: {item.shares}</div>
              
          </div>
        ))}
      </section>
    </>
  )
}

export default MyPortfolio