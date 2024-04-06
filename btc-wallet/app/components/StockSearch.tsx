'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import altImage from '../public/image.png'
import axios from 'axios'

interface Props {
    query: string;
}

const StockSearch = ({query}: Props) => {
    const [searchedQueryArray, setSearchedQueryArray] = useState([]);
    const [queryStockValue, setQueryStockValue] = useState("")

    useEffect(()=>{
        const queryStockResult = async () => {
            console.log("pogger")
            const queryStockValue = query
            console.log(queryStockValue)
            const response = await axios.get("http://localhost:8000/query-stock-data", {
                params: { queryStockValue: queryStockValue },
            });
            console.log(response.data)
            setSearchedQueryArray(response.data)
        }
        queryStockResult()
    }, []);
    const queryStock = async (e) => {
        e.preventDefault()
        const response = await axios.get("http://localhost:8000/query-stock-data", {
            params: { queryStockValue: queryStockValue },
        });
        setSearchedQueryArray(response.data)
    }
    return (
        <>
          <section className = "sm:pl-16 md:pl-36 lg:pl-40 xl:pl-56">
            <div className = 'text-lg font-bold'>Search Company</div>
            <form onSubmit={queryStock}>
              <input
                  type="text"
                  value={queryStockValue}
                  onChange={(e) => {
                  setQueryStockValue(e.target.value);
                  }}
                  className="border mt-2 mb-2 p-1 h-10 border-black rounded-md border-opacity-30 search-bar-width "
                  placeholder="Enter company symbol/name"
              ></input>
            </form>
            <div className="overflow-y-auto flex flex-col search-result-box">
              {searchedQueryArray.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row space-x-2 h-16 search-result justify-start bg-white border border-grey-400 rounded-xl px-8 items-center justify-between"
                >
                  <div className="flex flex-row items-center space-x-2">
                    <img
                      src={item[0].image}
                      alt={altImage}
                      className="h-10 w-10"
                    />
                    <div className = "pl-3">{item[0].symbol}</div>
                  </div>
                  <div className="">
                    {item[0].price} {item[0].currency}
                  </div>
                  <Link href={{
                    pathname: '/editportfolio',
                    query: { symbol: item[0].symbol },
                  }}>add</Link>
                </div>
              ))}
            </div>
          </section>
        </>
    )
}

export default StockSearch