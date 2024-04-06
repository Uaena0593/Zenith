import React from 'react'
import { AreaChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
const MyPortfolioGraph = () => {
  
  return (
    <>
        <div className = 'graph-height'>
          <AreaChart width={730} height={250}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis/>
          </AreaChart>
        </div>
    </>
  )
}

export default MyPortfolioGraph