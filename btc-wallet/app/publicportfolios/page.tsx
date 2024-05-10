import React, { useEffect } from 'react'
import axios from 'axios';

const PublicPortfolios = () => {
    useEffect(() => {
        const retrievePublicPortfolios = async() => {
            const response = await axios.get('http://localhost:3000/fetch-public-portfolios')
            console.log(response);
        };
        retrievePublicPortfolios();
    }, []);
    return (
        <>

        </>
    )
}

export default PublicPortfolios