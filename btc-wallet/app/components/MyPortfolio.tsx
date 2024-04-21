import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MyPortfolio = () => {
  const [stockPortfolio, setStockPortfolio] = useState([]);
  const [individualStockChart, setIndividualStockChart] = useState([])
  const [individualStockChartAxis, setIndividualStockChartAxis] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(null);
  const[currentValue, setCurrentValue] = useState(0)
  const[minYValue, setMinYValue] = useState(0)
  const[maxYValue, setMaxYValue] = useState(0)

  useEffect(() => {
    const fetchPortfolio = async() => {
      const response = await axios.get("http://localhost:8000/fetch-portfolio", { withCredentials: true });
      console.log(response.data);
      if (response.data.message == "Portfolio not found") {
        
      } else {
        setStockPortfolio(response.data);
      }
    };
    fetchPortfolio();
  }, []);

  const handleToggleVisibility = async (index, queryStockSymbol) => {
    const response = await axios.get('http://localhost:8000/fetch-stock-chart', {
      params: { queryStockSymbol: queryStockSymbol },
      withCredentials: true
    });
    if (response.data.length > 0) {
      console.log(response.data);
      const values = response.data.map(item => item.value);
      const minY = Math.min(...values);
      const maxY = Math.max(...values);
  
      setCurrentValue(response.data[response.data.length - 1].value);
      setMinYValue(minY * 0.99); 
      setMaxYValue(maxY * 1.01);
      setIndividualStockChart(response.data);
      if (visibleIndex === index) {
        setVisibleIndex(null);
      } else {
        setVisibleIndex(index);
      }
    } else {
      alert('No chart data available for this stock.');
    }
  };

  return (
    <>
      <section>
        {stockPortfolio.map((item, index) => (
          <div key={index}>
            <div
              className="flex flex-row mb-2 bg-white space-x-2 search-result rounded-xl px-8 items-center justify-between"
              onClick={() => handleToggleVisibility(index, item.stock_symbol)}
            >
              <div className='flex flex-col search-space-1'>
                <div className='font-bold text-lg'>{item.stock_symbol}</div>
                <div className='text-sm text-gray-500'>{item.stockDetails[0].companyName}</div>
              </div>
              <div className='flex flex-col text-left search-space'>
                <span>${item.buy_price}</span>
                <span className='text-sm text-gray-500'>Price Bought</span>
              </div>
              <div className='flex flex-col text-left search-space'>
                <span>{item.shares}</span>
                <span className='text-sm text-gray-500'>No. Shares</span>
              </div>
              <div className='flex flex-col text-left search-space'>
                <span>{item.stockDetails[0].exchangeShortName}</span>
                <span className='text-sm text-gray-500'>Exchange</span>
              </div>
              <div className = 'font-bold'>
                {visibleIndex === index ? 'v' : '<'}
              </div>
            </div>
            {visibleIndex === index && (
              <div className="mb-2 bg-white border rounded-xl search-result-chart px-8 py-4">
                <div className = 'font-bold text-2xl'>${item.stockDetails[0].price}</div>
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
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  );
};

export default MyPortfolio
