
import React, { useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import NavBarDark from '../components/NavBarDark';
import axios from 'axios'
import StockAPI from '../components/StockAPI'
import '../globals.css';

const HomePage = () => {
  return (
    <>
      <section className= "min-h-screen flex flex-col overflow-hidden">
        <NavBarDark />
        <div className = 'gradient-bg-1'>
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
        </div>
        <div className="flex flex-row justify-between max-w-4xl px-48 mt-4">
          <div className = "max-w-30">
            <h1 className="text-2xl font-bold mb-2">My portfolio</h1>
            <StockAPI></StockAPI>
          </div>
        </div>
      </section>
      <div className = ""></div>
    </>
  );
};

export default HomePage;