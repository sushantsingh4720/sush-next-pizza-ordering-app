"use client";

import Link from "next/link";
import React, {  useEffect, useState } from "react";
import styles from "../../styles/Login.module.css"
import { useSelector } from "react-redux";
import { useRouter } from 'next/router';

const Register = () => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user._id) {
      router.push('/');
    }
  }, [user?._id]);

  const registerHandler = async (e) => {
    e.preventDefault();

    // try {
    //   const res = await fetch("/api/auth/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name,
    //       email,
    //       password,
    //     }),
    //   });

    //   const data = await res.json();
    //   if (!data.success) return toast.error(data.message);
    //   setUser(data.user);
    //   toast.success(data.message);
    // } catch (error) {
    //   return toast.error(error);
    // }
  };


  if (user && user._id) {
    return <div>loading</div>; // or any other component you want to render instead
  }


  return (
    <div className={styles.login}>
      <section>
        <form onSubmit={registerHandler}>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter Name"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Enter Password"
          />
          <button type="submit">Sign Up</button>
          <p>OR</p>
          <Link href={"/login"}>Log In</Link>
        </form>
      </section>
    </div>
  );
};

export default Register;
