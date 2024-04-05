"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  query: string;
}
const AddInvestment = ({ query }: Props) => {
  const [numberOfShares, setNumberOfShares] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  useEffect(() => {
    const getInformation = async () => {
      try {
        console.log(query);
        const response = await axios.get(
          "http://localhost:8000/get-symbol-information",
          {
            params: { symbol: query },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    getInformation();
  }, []);
  const addInvestment = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get('http://localhost:8000/add-to-portfolio', { 
            params: { numberOfShares: numberOfShares, purchaseDate: purchaseDate, symbol: query },
            withCredentials: true 
        });
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};
  return (
    <>
      <section>
        <form onSubmit = { addInvestment }>
          <div>how many do you want</div>
          <input
            onChange={(e) => {
              setNumberOfShares(e.target.value);
            }}
          ></input>
          <div>what day is it</div>
          <input
            onChange={(e) => {
              setPurchaseDate(e.target.value);
            }}
          ></input>
          <button type="submit">asdf</button>
        </form>
      </section>
    </>
  );
};

export default AddInvestment;
