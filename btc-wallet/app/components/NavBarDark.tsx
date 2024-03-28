"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from 'axios';

const NavBar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const checkAuthentication = async () => {
    try {
      console.log(document.cookie);
      const response = await axios.get("http://localhost:8000/authenticateToken", { withCredentials: true });
      if (response.status === 200) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const logout = async () => {
    try {
      const response = await axios.get("http://localhost:8000/logout", { withCredentials: true });
      if (response.status === 200) {
        checkAuthentication();
      };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <nav className="sticky mt-5 z-20 mb-5 flex justify-between items-center bg-transparent px-48 py-2">
        <div className = "flex flex-row space-x-10 text-black ">
          <a href="/">chen</a>
          <ul className="flex flex-row space-x-12">
            <li>
              <Link href = "/creator">My wallet</Link>
            </li>
            <li>
              <Link href="/register">Resources</Link>
            </li>
          </ul>
        </div>
        <div className = "flex items-center">
          <ul className="flex flex-row space-x-10 items-center  text-black">
            {!authenticated ? (
                <>
                  <li>
                    <Link
                      href="/register"
                      className="px-6 py-2 bg-black bg-opacity-80 text-white rounded-2xl hover:bg-opacity-50 hover:text-white transition duration-300"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link href="/signin">Sign In</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                    onClick = { logout }
                    href = "/"
                    className="items-center justify-content px-6 py-2 mt-3 bg-black bg-opacity-80 text-white rounded-2xl hover:bg-opacity-50 hover:text-white transition duration-300"
                    >
                      My account
                    </Link>
                  </li>
                </>
              )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
