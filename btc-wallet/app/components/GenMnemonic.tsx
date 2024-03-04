'use client';
import React, { useState } from 'react';
import axios from 'axios';

const GenMnemonic = () => {
    const [passphrase, setPassphrase] = useState('');
    const [xpriv, setXpriv] = useState('')
    const [privatekey, setPrivateKey] = useState('')
    const [publickey, setPublicKey] = useState('')
    const [address, setAddress] = useState('')
    const generateMnemonic = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.get('http://localhost:8000/recovery', { params: { passphrase }});
        console.log(response.data);
        console.log(response.data.xpriv.privateKey)
        setPrivateKey(response.data.xpriv.privateKey)
      } catch (error) {
        console.log('Error:', error);
      }
    }
    
    const createKeys = async(e) => {
      try {
        const response = await axios.put('http://localhost:8000/createKeys', { params: { xpriv }});
      }
      catch {
        console.log(error)
      }
    }

    return (
      <>
        <form onSubmit={generateMnemonic}>
          <input
            type='text'
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
          <button type='submit'>submit passphrase</button>
        </form>
        <button onClick = { createKeys }>asdf</button>
        <div>private key: { privatekey }</div>
        <div>public key: { publickey }</div>
        <div>address: { address }</div>
      </>
    );
}

export default GenMnemonic;
