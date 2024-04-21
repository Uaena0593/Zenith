import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    query: string;
}

const StockInformationBox = ({ query }: Props) => {
  const [individualStockChart, setIndividualStockChart] = useState([])
  const [stockInformation, setStockInformation] = useState([])
  const[currentValue, setCurrentValue] = useState(0)
  const[minYValue, setMinYValue] = useState(0)
  const[maxYValue, setMaxYValue] = useState(0)

  useEffect(() => {
    const fetchStockInformation = async () => {
        const response = await axios.get('http://localhost:8000/fetch-stock-chart', {
            params: { queryStockSymbol: query },
            withCredentials: true
        });
        const response1 = await axios.get('http://localhost:8000/query-stock-information', {params: { queryStockValue: query}})
        console.log(response1.data)
        setStockInformation(response1.data)
        console.log(stockInformation)
        if (response.data.length > 0) {
          const values = response.data.map(item => item.value);
          const minY = Math.min(...values);
          const maxY = Math.max(...values);
      
          setCurrentValue(response.data[response.data.length - 1].value);
          setMinYValue(minY * 0.99); 
          setMaxYValue(maxY * 1.01);
          setIndividualStockChart(response.data);

        } else {
          alert('No chart data available for this stock.');
        }
      };
    fetchStockInformation();
  }, []);


  return (
    <>
      <section className = 'mb-2  border rounded-xl search-result-chart-1 py-4 pr-3'>
        <div className = 'flex flex-row items-end'>
          <div className = 'font-bold text-3xl'>${currentValue} </div>
          <div className = 'text-gray-500 text-md ml-2'>USD</div>
        </div>
        <ResponsiveContainer width="100%">
            <AreaChart
            data = {individualStockChart}
            >
            <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="green" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="green" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'transparent' }}
            />
            <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'transparent'}}
                width={0}
                domain={[minYValue, maxYValue]}
            />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="green" fill="url(#colorValue)" />
            </AreaChart>
        </ResponsiveContainer>
        {stockInformation.length > 0 && (
          <div className = 'flex flex-col'>
              <div className = 'flex flex-row items-center'>
                
                  <img src={stockInformation[0].image} className = 'w-6 h-6'/>
                  <div className = 'flex flex-row justify-end items-end'>
                    <div className = 'font-bold text-2xl ml-2'>{stockInformation[0].symbol}</div>
                    <div className = 'text-md text-gray-500 ml-2'>{stockInformation[0].companyName}</div>
                  </div>
            
              </div>
              <div className = 'flex flex-col justify-end'>
                <div>Current Price: {stockInformation[0].price}</div>
                <div>Exchange: {stockInformation[0].exchangeShortName}</div>
                <div>Industry: {stockInformation[0].industry}</div>
              </div>
          </div>
        )}
      </section>
    </>
  );
};

export default StockInformationBox
