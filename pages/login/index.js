"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout } from "../../redux/userSlice";

import Link from "next/link";
import { useRouter } from 'next/router';
import Loading from "../../components/Loading";

const Login = () => {
  const { user, loading, isAuthenticated } = useSelector((store) => store.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  // Move the logic here
  if (isAuthenticated===true&&loading===false ) {
    router.push('/');
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (loading) {
    return <Loading />;
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
