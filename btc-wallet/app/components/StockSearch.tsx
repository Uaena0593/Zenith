'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import altImage from '../public/image.png'
import axios from 'axios'
import NavBarDark from './NavBarDark';

interface Props {
    query: string;
}

const StockSearch = ({query}: Props) => {
    const [searchedQueryArray, setSearchedQueryArray] = useState([]);
    const [queryStockValue, setQueryStockValue] = useState("")
    const router = useRouter();

    useEffect(()=>{
        const queryStockResult = async () => {
            console.log("pogger")
            const queryStockValue = query
            console.log(queryStockValue)
            const response = await axios.get("http://localhost:8000/query-stock-data", {
                params: { queryStockValue: queryStockValue },
            });
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

          <NavBarDark></NavBarDark>
          <section className = "">
            <form onSubmit={queryStock}>
              <input
                  type="text"
                  value={queryStockValue}
                  onChange={(e) => {
                  setQueryStockValue(e.target.value);
                  }}
                  className="border mb-2 p-1 w-64 border-black rounded-md border-opacity-30"
                  placeholder="Enter company symbol/name"
              ></input>
            </form>
            <div className="h-96 overflow-y-auto w-80">
              {searchedQueryArray.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row space-x-2 border border-grey-400 rounded-xl px-3 items-center h-10 w-64 justify-between"
                >
                  <div className="flex flex-row items-center space-x-2">
                    <img
                      src={item[0].image}
                      alt={altImage}
                      className="h-10 w-10"
                    />
                    <div>{item[0].symbol}</div>
                  </div>
                  <div className="">
                    {item[0].price} {item[0].currency}
                  </div>
                  <Link href={{
                    pathname: '/editportfolio',
                    query: { symbol: item[0].symbol },
                  }}>hallo</Link>
                </div>
              ))}
            </div>
          </section>
        </>
    )
}

export default StockSearch