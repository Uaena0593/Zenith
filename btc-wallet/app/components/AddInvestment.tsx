"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import type { DatePickerProps } from 'antd';
import { DatePicker, TimePicker} from 'antd';
import dayjs from 'dayjs'
import type { TimePickerProps } from 'antd';
import Switch from '@mui/material/Switch';
import { useRouter } from "next/navigation";

const label = { inputProps: { 'aria-label': 'har har har' } };
interface Props {
  query: string;
}
const AddInvestment = ({ query }: Props) => {
  const [numberOfShares, setNumberOfShares] = useState("");
  const [stockBuyDate, setStockBuyDate] = useState("");
  const [stockBuyTime, setStockBuyTime] = useState("");
  const [addWatchlist, setAddWatchlist] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState("");
  const format = 'HH:mm';
  const router = useRouter();

  useEffect(() => {
    const getInformation = async () => {
      try {
        await axios.get(
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

  useEffect(() => {
    updateBuyPrice();
  }, [numberOfShares, stockBuyDate, stockBuyTime]);

  const addInvestment = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!numberOfShares) {
      alert('Please enter the number of shares.');
      return;
    }
    if (!stockBuyDate) {
      alert('Please enter the purchase date.');
      return;
    }
    if (!stockBuyTime) {
      alert('Please enter the purchase time.');
      return;
    }
    if (!query) {
      alert('Please enter the stock symbol.');
      return;
    }
    if (isNaN(Number(numberOfShares))) {
      alert('Number of shares must be a number.');
      return;
    }
    try {
      
      const response = await axios.get(
        "http://localhost:8000/add-to-portfolio",
        {
          params: {
            numberOfShares: numberOfShares,
            purchaseDate: stockBuyDate,
            purchaseTime: stockBuyTime,
            symbol: query,
            addToWatchlist: addWatchlist,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      router.push('/landingpage')
      
    } catch (error) {
      console.log(error);
    }
  };
  const updateBuyPrice = async ()=> {
    if (!numberOfShares || !stockBuyDate || !stockBuyTime) {
      return;
    }
    try {

      const response = await axios.get('http://localhost:8000/update-buy-price',  { params: {
        numberOfShares: numberOfShares,
        purchaseDate: stockBuyDate,
        purchaseTime: stockBuyTime,
        symbol: query,
      }})
      console.log(response.data)
      setPurchasePrice(response.data)
    }catch(e) {
      console.log(e)
    }
  };

  const changeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(dateString);
    setStockBuyDate(`${dateString}`)
  };

  const changeStockTime: TimePickerProps['onChange'] = (time, timeString) => {
    console.log(timeString);
    setStockBuyTime(`${timeString}`)
  };

  return (
    <>
      <section className="flex flex-row">
        <div className="border bg-white p-8 rounded-xl stock-information-query-box right-box-width">
          <div className = 'text-xl font-bold mb-3'>Add Shares</div>
          <form onSubmit={addInvestment} className = 'flex flex-col'>
            <input
              placeholder = 'Shares'
              className = 'border mb-2 py-1 pl-3 w-48 add-shares-box-width border-black rounded-lg border-opacity-20'
              onChange={(e) => {
                setNumberOfShares(e.target.value);
              }}
            ></input>
            
            
            <DatePicker className = 'h-9 add-shares-box-width' onChange={ changeDate }/>
            <div className = 'mt-3'>
              <TimePicker className = 'add-shares-box-width' defaultValue={dayjs('00:00', format)} format={format} onChange={ changeStockTime}/>
            </div>
            <div className = 'flex flex-row items-center mt-2'>
              <div className = 'font-bold'>Watchlist</div>
              <Switch onChange={()=>{setAddWatchlist(!addWatchlist)}} {...label}/>
            </div>
            <div className  = ''><strong>Purchase Price:</strong> {purchasePrice}</div>
            <button type="submit" className = 'items-center justify-content px-6 py-2 mt-3 bg-black text-white rounded-2xl hover:bg-opacity-50 hover:text-white transition duration-300'>Confirm</button>
         </form>
        </div>
      </section>
    </>
  );
};

export default AddInvestment;
