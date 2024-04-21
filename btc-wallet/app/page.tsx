'use client';
import React from 'react';
import Link from "next/link";
import Image from "next/image";
import NavBar from './components/NavBar';
import blockchainPNG from './public/image (1).png';
import './globals.css';


const HomePage = () => {
  return (
    <>
      <section className= "min-h-screen flex flex-col ow-background">
        <div className = 'sm:px-16 md:px-36 lg:px-40 xl:px-56'>
          <NavBar />
            <div className = 'gradient-bg'>
              <div className="g1"></div>
              <div className="g2"></div>
              <div className="g3"></div>
              <div className="g4"></div>
              <div className="g5"></div>
            </div>
            <div className="flex flex-row justify-between mt-8 max-w-4xl">
              <div className = "sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-lg">
                <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold ">Accessible online investment portfolio</h1>
                <p className="text-lg mt-6 color-grey" style = {{lineHeight: 1.3}}>View your investments anytime, anywhere with our portfolio maker. Manage your digital assets and create transactions with ease, offering convenience and peace of mind.</p>
                <div className = "flex flex-row mt-3">
                  <Link href="/register" className="inline-border px-4 py-2 bg-black bg-opacity-80 text-white rounded-2xl hover:bg-opacity-60 hover:text-white transition duration-300">Get Started &gt;</Link>
                  <Link href="/register" className="inline-border px-4 py-2 ml-4 bg-transparent bg-opacity-80 text-black rounded-2xl hover:bg-opacity-60 hover:text-opacity-20 transition duration-300">About &gt;</Link>
                </div>
              </div>
            </div>
        </div>
      </section>

      <section className="min-h-screen flex flex-col">

      </section>
    </>
  );
};

export default HomePage;