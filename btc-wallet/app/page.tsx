'use client';
import React from 'react';
import Link from "next/link";
import Image from "next/image";
import NavBar from './components/NavBar';
import blockchainPNG from './public/image (1).png'; 

const HomePage = () => {
  return (
    <>
      <NavBar />
      <section className="min-h-screen flex flex-col">
        <div className="flex flex-row justify-between max-w-4xl px-48 mt-16">
          <div className = "max-w-30">
            <h1 className="text-7xl font-bold">Accessible online blockchain wallet</h1>
            <p className="text-md mt-4 color-grey" style={{ lineHeight: '1.2' }}>Access your cryptocurrency securely anytime, anywhere with our online blockchain wallet. Safeguard your digital assets and manage your transactions with ease, offering convenience and peace of mind</p>
            <Link href="/register" className = "inline-block px-4 py-1.5 mt-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Get Started</Link>
          </div>
          <div className="flex items-center flex-shrink-0">
            <Image className = "ml-40 mb-10" alt = "blockchain" src = {blockchainPNG} width = {420} height = {420}></Image>
          </div>
        </div>
      </section>
      <section className="min-h-screen flex flex-col">

      </section>
    </>
  );
};

export default HomePage;