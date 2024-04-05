import React, { useEffect } from 'react'
import axios from 'axios'

const MyPortfolio = () => {
  useEffect(() => {
    const fetchPortfolio = async() => {
      const response = await axios.get("http://localhost:8000/fetch-portfolio", { withCredentials: true })
      console.log(response.data)
    }
    fetchPortfolio()
  },[])
  return (
    <>
        <section>

        </section>
    </>
  )
}

export default MyPortfolio