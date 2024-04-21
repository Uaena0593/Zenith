import React, { useState, useEffect } from 'react'
import { AreaChart, Area, LineChart , Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'

const MyPortfolioGraph = () => {
  const[myPortfolioData, setMyPortfolioData] = useState([])
  const[minYValue, setMinYValue] = useState(0)
  const[maxYValue, setMaxYValue] = useState(0)
  const[currentValue, setCurrentValue] = useState(0)
  useEffect(()=> {
    const testing = async() =>{
      try{
        const response = await axios.get('http://localhost:8000/fetch-myportfolio-data', { withCredentials : true })
        setCurrentValue(response.data[response.data.length - 1].value);
        setMinYValue(Math.min(...myPortfolioData.map(item => item.value)))
        setMaxYValue(Math.max(...myPortfolioData.map(item => item.value)))
        setMyPortfolioData(response.data)
      } catch (e) {
        console.log(e)
      }
    }
    testing()
  }, [])
  return (
    <>
      <div className = 'flex flex-row items-end'>
        <div className = 'font-bold text-3xl'>${currentValue.toLocaleString()} </div>
        <div className = 'text-gray-500 text-md ml-2'>USD</div>
      </div>
      <div className = 'flex flex-col graph-height items-start'>
        <ResponsiveContainer width = "100%">
        <AreaChart
          data={myPortfolioData}
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
            tick={{ fill: 'transparent' }}
            domain={[minYValue * 0.8, maxYValue * 1.2]}
            width={0}
          />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="green" fill="url(#colorValue)" />
        </AreaChart>
        </ResponsiveContainer>
        
      </div>
    </>
  )
}

export default MyPortfolioGraph