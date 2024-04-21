'use client'
import React from 'react'
import AddInvestment from '../components/AddInvestment'
import { useSearchParams } from 'next/navigation'
import NavBarDark from "../components/NavBarDark"
import StockInformationBox from '../components/StockInformationBox'
import StockAPI from '../components/StockAPI'

const EditPortfolio = () => {
    const searchParams = useSearchParams()
    const search = searchParams.get('symbol')
    return (
        <>
            <section className = 'ow-background'>
                <div className = 'sm:px-16 md:px-36 lg:px-40 xl:px-56 flex flex-col'>
                    <NavBarDark/>
                    <div className = 'flex flex-row'>
                        <div className = ''>
                            <StockInformationBox query ={search}></StockInformationBox>
                        </div>
                        <div className = 'flex flex-col'>
                            <StockAPI></StockAPI>
                            <AddInvestment query ={search} ></AddInvestment>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default EditPortfolio