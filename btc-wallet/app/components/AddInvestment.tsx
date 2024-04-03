'use client'
import React, { useEffect } from 'react'
import axios from 'axios'

interface Props {
    query:string;
}
const AddInvestment = ({query}: Props) => {
  useEffect(()=>{
    const getInformation = async()=>{
        try {
            console.log("poggers")
            console.log(query)
            const response = await axios.get('http://localhost:8000/get-symbol-information',{
                params: { symbol: query },
            })
        } catch(error) {
            console.log(error)
        }
    }
    getInformation()

  }, [])
  return (
    <>
      <section>

      </section>
    </>
  )
}

export default AddInvestment