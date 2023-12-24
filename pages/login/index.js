"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../../styles/Login.module.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from 'next/router';
import Loading from "../../components/Loading";

const Login = () => {
  const { user } = useSelector((store) => store.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  
  useEffect(() => {
     if (user._id) {
       router.push('/');
     }
   }, [user?._id]);

  const loginHandler = async (e) => {
    e.preventDefault();

    // try {
    //   const res = await fetch("/api/auth/login", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       email,
    //       password,
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
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
    return <Loading/>; // or any other component you want to render instead
  }

  return (
    <div className={styles.login}>
      <section>
        <form onSubmit={loginHandler}>
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
          <button type="submit">Login</button>

          <p>OR</p>
          <Link href={"/register"}>New User</Link>
        </form>
      </section>
    </div>
  );
};

export default Login;
