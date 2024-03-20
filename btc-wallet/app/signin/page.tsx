'use client';
import React, { useState } from 'react'
import axios from 'axios'

const SignIn = () => {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

    const signIn = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post('http://localhost:8000/login', {
            username,
            password,
        });
        console.log(response.data);
        } catch (error) {
        console.log(error);
        }
    };  
    return (
        <section>
            <form onSubmit={ signIn }>
                <input
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                />
                <input
                type="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                />
                <button type = "submit">sign in</button>
            </form>
        </section>
    )
}

export default SignIn