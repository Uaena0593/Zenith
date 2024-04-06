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
        <form onSubmit={queryStock}>
          <input
            type="text"
            value={queryStockValue}
            onChange={(e) => {
              setQueryStockValue(e.target.value);
            }}
            className="border mb-2 p-2 right-box-width border-black rounded-md border-opacity-30"
            placeholder="Enter company symbol/name"
          ></input>
        </form>
      </section>
    </>
  );
};

export default StockAPI;
