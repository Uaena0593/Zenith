'use client'
import React from 'react'
import AddInvestment from '../components/AddInvestment'
import { useSearchParams } from 'next/navigation'
import NavBarDark from "../components/NavBarDark"

const EditPortfolio = () => {
    const searchParams = useSearchParams()
    const search = searchParams.get('symbol')
    return (
        <>
            <NavBarDark/>
            <div>{search}</div>
            <AddInvestment query ={search} ></AddInvestment>
        </>
    )
}

export default EditPortfolio 