"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import type { DatePickerProps } from 'antd';
import { DatePicker, TimePicker, Space } from 'antd';
import dayjs, {Dayjs} from 'dayjs'
import type { TimePickerProps } from 'antd';

interface Props {
  query: string;
}
const AddInvestment = ({ query }: Props) => {
  const [numberOfShares, setNumberOfShares] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [costOfStock, setCostOfStock] = useState("");
  const [stockBuyDate, setStockBuyDate] = useState("");
  const [stockBuyTime, setStockBuyTime] = useState("");
  const format = 'HH:mm';

  const changeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(dateString);
    setStockBuyDate(`${dateString}`)
  };

  const changeStockTime: TimePickerProps['onChange'] = (time, timeString) => {
    console.log(timeString);
    setStockBuyTime(`${timeString}`)
  };

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
      console.log(typeof numberOfShares)
      console.log(typeof stockBuyTime)
      console.log(stockBuyDate)
      console.log(query)
      const response = await axios.get(
        "http://localhost:8000/add-to-portfolio",
        {
          params: {
            numberOfShares: numberOfShares,
            purchaseDate: stockBuyDate,
            purchaseTime: stockBuyTime,
            symbol: query,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const testing = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8000/testing", {params: { stockBuyDate : stockBuyDate, stockBuyTime },});
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="flex flex-row mt-8 ">
        <div className="stock-information-box sm:ml-16 md:ml-36 lg:ml-40 xl:ml-56"></div>
        <div className="border ml-4 p-8 rounded-xl stock-information-query-box right-box-width">
          <form onSubmit={addInvestment}>
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

            <div>curr buy price: {costOfStock}</div>
            <DatePicker onChange={ changeDate } />
            <TimePicker defaultValue={dayjs('00:00', format)} format={format} onChange={ changeStockTime}/>
            <button onClick={testing}>test</button>
            <button type="submit">asdf</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddInvestment;
