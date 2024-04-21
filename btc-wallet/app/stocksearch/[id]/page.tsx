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
        <div className = 'sm:px-16 md:px-36 lg:px-40 xl:px-56 flex flex-col'>
          <NavBarDark />
          <div className = 'flex flex-row mt-2'>
            <StockSearch query ={params.id}/>
            <div className = 'ml-4'>
              <Watchlist></Watchlist>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default StockSearchPage