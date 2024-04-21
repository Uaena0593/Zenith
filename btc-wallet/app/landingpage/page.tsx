'use client'
import React, { useEffect, useState } from 'react';
import NavBarDark from '../components/NavBarDark';
import StockAPI from '../components/StockAPI'
import axios from 'axios'
import '../globals.css';
import MyPortfolio from '../components/MyPortfolio';
import Watchlist from '../components/Watchlist';
import MyPortfolioGraph from '../components/MyPortfolioGraph';
import EmptyPortfolio from '../components/EmptyPortfolio';

const HomePage = () => {
  const [portfolioVisibility, setPortfolioVisibility]= useState(true);
  useEffect(()=> {
    const checkPortfolio = async () => {
      try {
        const response = await axios.get('http://localhost:8000/check-portfolio', { withCredentials: true })
        console.log(response.data)
        if (response.data.message == 'Portfolio not found') {
          setPortfolioVisibility(false)
        } else (
          setPortfolioVisibility(true)
        )
      } catch (e) {
        console.log(e)
        setPortfolioVisibility(false)
      }
    }
    checkPortfolio()
    console.log(portfolioVisibility)
  }, [])
  return (
    <>
      <section className= "min-h-screen flex flex-col overflow-hidden ow-background-1">
        <div className = 'sm:px-16 md:px-36 lg:px-40 xl:px-56 '>
          <NavBarDark />
          <div className = 'gradient-bg-1'>
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
          </div>
          <div className = "mt-4">
            <div className="flex flex-row max-w-4xl">
              <div className = "">
                <MyPortfolioGraph/>
                <h1 className="text-2xl font-bold mb-6">My portfolio</h1>
                {portfolioVisibility ? (
                  <MyPortfolio />
                ) : (
                  <EmptyPortfolio />
                )}
              </div>
              <div className = 'ml-4'>
                <StockAPI/>
                <div className = ''>
                  <Watchlist/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;