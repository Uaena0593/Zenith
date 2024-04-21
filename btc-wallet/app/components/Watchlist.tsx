import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])

  useEffect(()=> {
    const fetchWatchlist = async() => {
      const response = await axios.get("http://localhost:8000/fetch-watchlist", { withCredentials: true });
      console.log(response.data);
      setWatchlist(response.data);
    }
    fetchWatchlist();
  },[])
  return (
    <>
        <section className = "">
            <div className = 'text-lg font-bold'>Watchlist</div>
            <div className="flex flex-col border overflow-y-auto bg-white rounded-xl mt-2 watch-list-box p-6">
              {watchlist.map((item, index) => (
                <div className='p-4 mb-2 flex justify-between box-shadow-watchlist items-center border rounded-xl watch-list-content'>
                  <div className='flex flex-row items-center'>
                    <img
                      src={item.stockDetails[0].image}
                      className="h-8 w-8"
                    />
                    <div className='text-left ml-3'>{item.stock_symbol}</div>
                  </div>
                  <div className='flex flex-col text-right'>
                    <div>${item.stockDetails[0].price}</div>
                  </div>
              </div>
              ))}
            </div>
        </section>
    </>
  )
}

export default Watchlist