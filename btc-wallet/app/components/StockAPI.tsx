'use client';
import React, { useState } from "react";
import axios from "axios";
import altImage from "../public/image.png";
import { useRouter } from "next/navigation";

const StockAPI = () => {
  const [queryStockValue, setQueryStockValue] = useState("");
  const [searchedQueryArray, setSearchedQueryArray] = useState([]);
  const router = useRouter();

  const queryStock = async (e) => {
    e.preventDefault();
    try {
      router.push(`/stocksearch/${queryStockValue}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="flex flex-row justify-between w-full">
        <div className="">
          <button className="items-center px-5 py-2 mt-3 text-md bg-gray-400 bg-opacity-80 text-white rounded-2xl hover:bg-opacity-50 hover:text-white transition duration-300">
            Add Investment
          </button>
        </div>
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
      </section>
    </>
  );
};

export default StockAPI;
