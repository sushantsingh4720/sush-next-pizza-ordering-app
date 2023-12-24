import axios from "axios";
import Head from "next/head";
import Featured from "../components/Featured";
import PizzaList from "../components/PizzaList";
import styles from "../styles/Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllCart } from "../redux/cartSlice";

export default function Home() {

  const { product } = useSelector((state) => state.product);

  const dispatch=useDispatch()

  useEffect(() => {
    dispatch(getAllCart());
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza Restaurant in Newyork</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Featured />
      <PizzaList pizzaList={product} />
    </div>
  );
}
