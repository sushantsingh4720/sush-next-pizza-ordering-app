import axios from "axios";
import React, { useState } from "react";
import PizzaList from "../../components/PizzaList";
import AddButton from "../../components/AddButton";
import Add from "../../components/Add";
import { useSelector } from "react-redux";

const Product = ({pizzaList}) => {
  const {user}=useSelector(state=>state.user)
  const [close, setClose] = useState(false);
  return (
    <>
      {user?.isSeller&&<AddButton setClose={setClose} />}
      <PizzaList pizzaList={pizzaList}/>
      {close && <Add setClose={setClose} />}
    </>
  );
};

export default Product;

export const getServerSideProps = async (ctx) => {
    try {
      const res = await axios.get("http://localhost:3000/api/products");
      console.log("res.data,",res.data.product)
      return {
        props: {
          pizzaList: res.data.product,
        },
      };
    } catch (error) {
      console.log(error)
      return {
        props: {
          pizzaList: [],
        },
      };
    }
  };