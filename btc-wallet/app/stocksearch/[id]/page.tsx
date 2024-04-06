'use client';
import React from 'react'
import StockSearch from '@/app/components/StockSearch'
import { useSearchParams } from 'next/navigation';
import NavBarDark from '../../components/NavBarDark';
import Watchlist from '@/app/components/Watchlist';

const StockSearchPage = ({ params }: { params: { id : string } }) => {
  return (
    <>
      <section className = 'ow-background'>
        <NavBarDark />
        <div className = 'flex flex-row mt-8'>
          <StockSearch query ={params.id}/>
          <div className = 'ml-4'>
            <Watchlist></Watchlist>
          </div>
        </div>
      </section>
    </>
  )
}

export default StockSearchPage