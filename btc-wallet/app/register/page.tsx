'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className = "min-h-screen flex flex-col">
      <form onSubmit={ createAccount }>
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
        <button type = "submit">register</button>
      </form>
      <h1></h1>

    </section>
  );
}
export default CreateAccount
