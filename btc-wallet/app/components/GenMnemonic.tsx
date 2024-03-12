'use client';
import React, { useState } from 'react';
import axios from 'axios';

const GenMnemonic = () => {
    const [passphrase, setPassphrase] = useState('');
    const [mnemonic, setMnemonic] = useState('')
    const [xpriv, setXpriv] = useState('')
    const [rootPrivateKey, setRootPrivateKey] = useState('')
    const [numKeys, setNumKeys] = useState('')
    const [generatedKeys, setGeneratedKeys] = useState([])
    const generateMnemonic = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.get('http://localhost:8000/recovery', { params: { passphrase }});
        console.log(response.data);
        setXpriv(response.data.xpriv.xprivkey)
        setRootPrivateKey(response.data.xpriv.privateKey)
        setMnemonic(response.data.mnemonic)
      } catch (error) {
        console.log('Error:', error);
      }
    }
    
    const createKeys = async(e) => {
      e.preventDefault();
      try {
        const response = await axios.get('http://localhost:8000/createKeys', { params: { xpriv, numKeys, rootPrivateKey }});
        console.log(response.data)
        setGeneratedKeys(response.data)
      }
      catch(error) {
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
          <button type='submit'>generate extended private key</button>
        </form>
        <form onSubmit = { createKeys }>
        <input
            type='text'
            value={ numKeys }
            onChange={(e) => setNumKeys(e.target.value)}
          />
          <button type = 'submit'>create inputted amount of keys</button>
        </form>
        <div> mnemonic: {mnemonic} </div>
        <div >xprivkey/master key: { xpriv }</div>
        <div className = 'mb-10'>root private key: { rootPrivateKey }</div>
        <ul className="mb-8">
          {generatedKeys.map((key, index) => (
            <ul key={index} style={{ marginBottom: '10px' }}>
              <li>Public Key: {key.publicKey}</li>
              <li> Private Key: {key.privateKey}</li>
              <li> address: {key.address}</li>
            </ul>
          ))}
        </ul>



      </>
    );
}

export default GenMnemonic;
