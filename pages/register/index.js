"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import { registerUser } from "../../redux/userSlice";

const Register = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  // Move the logic here
  // Move the logic here
  if (isAuthenticated === true && loading === false) {
    router.push("/");
  }

  const registerHandler = async (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name }));
  };

  if (loading) {
    return <Loading />;
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
