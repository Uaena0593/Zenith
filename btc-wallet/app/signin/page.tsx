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
        <section className = 'min-h-screen bg-custom-gray flex flex-col items-center'>
            <div className = "flex flex-col items-start mb-4">
                <div className = 'text-black text-lg mt-16 mb-8'>chen</div>
                <div className = 'bg-white border rounded-md p-12 w-96 h-96 box-shadow'>
                    <div className = 'text-black text-xl mb-4'>Sign in to your account</div>
                    <div>Username</div>
                    <form onSubmit={ signIn } className = 'flex flex-col items-center'>
                        <input
                        className = "border mb-2 p-1 w-72 border-black rounded-sm border-opacity-20"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        />
                        <div>Password</div>
                        <input
                        className = "border mb-2 p-1 w-72 border-black rounded-sm border-opacity-20"
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        />
                        <button type = "submit">sign in</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignIn