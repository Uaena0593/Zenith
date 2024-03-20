'use client';
import React from 'react';

const CheckoutButton = () => {
  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:8000/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            { id: 1, quantity: 3 },
            { id: 2, quantity: 1 },
          ],
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const { url } = await response.json();
      window.location = url;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleCheckout}>Checkout</button>
  );
};

export default CheckoutButton;
