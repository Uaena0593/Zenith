'use client';
import React, { useState } from "react";
import axios from "axios";
import altImage from '../public/image.png'
import { useRouter } from "next/navigation";

const StockAPI = () => {
    const [queryStockValue, setQueryStockValue] = useState("");
    const [searchedQueryArray, setSearchedQueryArray] = useState([]);
    const router = useRouter();

    const queryStock = async (e) => {
    e.preventDefault()
      try {
          console.log(queryStockValue)
          const response = await axios.get("http://localhost:8000/query-stock-data", {
              params: { queryStockValue: queryStockValue },
          });
          setSearchedQueryArray(response.data)
          console.log(response.data)
      } catch (error){
        console.log(error)
      }
    }
    return (
    <>
      <section className = 'flex flex-row justify-between w-full'>
        <div className = ''>
          <button className = "items-center px-5 py-2 mt-3 text-md bg-gray-400 bg-opacity-80 text-white rounded-2xl hover:bg-opacity-50 hover:text-white transition duration-300">Add Investment</button>
        </div>
        <form onSubmit={()=> {
          router.push(`/stocksearch?query=${queryStockValue}`)
          }}>
          <input
            type="text"
            value={queryStockValue}
            onChange={(e) => {
              setQueryStockValue(e.target.value);
            }}
            className = "border mb-2 p-1 w-64 border-black rounded-md border-opacity-30"
            placeholder = "Enter company symbol/name"
          ></input>
          <div className = 'h-80 overflow-y-auto'>
              {searchedQueryArray.map((item, index) => (
                  <div key={index} className = 'flex flex-row space-x-2 border border-grey-400 rounded-xl px-3 items-center h-10 w-64 justify-between'>
                      <div className = 'flex flex-row items-center space-x-2'>
                        <img src={item[0].image} alt = {altImage} className = 'h-10 w-10' />
                        <div>{item[0].symbol}</div>
                      </div>
                      <div className = ''>{item[0].price} {item[0].currency}</div>
                  </div>
              ))}
          </div>
        </form>
      </section>
    </>
  );
};

export default StockAPI;
