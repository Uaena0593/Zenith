'use client'
import React, { useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import NavBarDark from '../components/NavBarDark';
import axios from 'axios'
import StockAPI from '../components/StockAPI'
import '../globals.css';
import MyPortfolio from '../components/MyPortfolio';
import Watchlist from '../components/Watchlist';
import MyPortfolioGraph from '../components/MyPortfolioGraph';

const HomePage = () => {
  return (
    <>
      <section className= "min-h-screen flex flex-col overflow-hidden ow-background">
        <NavBarDark />
        <div className = 'gradient-bg-1'>
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
        </div>
        <div className = "sm:pl-16 md:pl-36 lg:pl-40 xl:pl-56 mt-4">
          
          <div className="flex flex-row max-w-4xl">
            <div className = "max-w-30">
              <MyPortfolioGraph/>
              <h1 className="text-2xl font-bold mb-2">My portfolio</h1>
              <MyPortfolio/>
            </div>
            <div className = 'ml-4'>
              <StockAPI/>
              <Watchlist/>
            </div>
          </div>
        </div>
      </section>
      <div className = ""></div>
    </>
  );
};

export default HomePage;