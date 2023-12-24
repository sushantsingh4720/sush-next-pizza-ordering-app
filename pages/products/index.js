import axios from "axios";
import React, { useState } from "react";
import PizzaList from "../../components/PizzaList";
import AddButton from "../../components/AddButton";
import Add from "../../components/Add";
import { useSelector } from "react-redux";

const Product = ({ pizzaList }) => {
  const { user} = useSelector(state => state.user);
  const { product} = useSelector(state => state.product);
  const [close, setClose] = useState(false);

  return (
    <>
      {user?.isSeller && <AddButton setClose={setClose} />}
      <PizzaList pizzaList={product} />
      {close && <Add setClose={setClose} />}
    </>
  );
};

export default Product;
