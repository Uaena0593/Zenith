"use client";
import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <>
      <nav className="sticky top-0 z-20 mb-5 flex justify-between items-center bg-white px-48 py-2">
        <div className = "flex flex-row space-x-10">
          <a href="/">chen</a>
          <ul className="flex flex-row space-x-12">
            <li>
              <Link href = "/creator">Creator</Link>
            </li>
            <li>
              <Link href="/register">Resources</Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-row space-x-10 items-center">
            <li>
              <Link href="/register" className = "inline-block px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Get Started</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
