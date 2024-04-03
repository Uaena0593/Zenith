'use client';
import React from 'react'
import StockSearch from '@/app/components/StockSearch'
import { useSearchParams } from 'next/navigation';

const StockSearchPage = ({ params }: { params: { id : string } }) => {
  return (
    <>
      <StockSearch query ={params.id}/>
    </>
  )
}

export default StockSearchPage