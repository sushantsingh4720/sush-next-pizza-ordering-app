import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductInCart,
  getAllCart,
  resetAddCart,
} from "../../redux/cartSlice";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const Product = ({ pizza }) => {
  
  const { isAuthenticated } = useSelector((state) => state.user);
  const { success, loading } = useSelector((state) => state.cart);
  const [price, setPrice] = useState(pizza.prices[0]);
  const [size, setSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const changePrice = (number) => {
    setPrice(price + number);
  };

  const handleSize = (sizeIndex) => {
    setSize(sizeIndex);
    const difference = pizza.prices[sizeIndex] - pizza.prices[size];
    changePrice(difference);
  };

  const handleChange = (e, option) => {
    const checked = e.target.checked;

    if (checked) {
      changePrice(option.price);
      setExtras((prev) => [...prev, option]);
    } else {
      changePrice(-option.price);
      setExtras(extras.filter((extra) => extra._id !== option._id));
    }
  };

  const handleClick = () => {
    if (isAuthenticated === false) {
      toast.error("Please login first");
      return router.push("/login");
    }
    dispatch(
      addProductInCart({ productId: pizza._id, extras, quantity, size })
    );
  };

  useEffect(() => {
    if (success) {
      dispatch(resetAddCart());
      dispatch(getAllCart());
      setPrice(pizza.prices[0]);
      setSize(0);
      setExtras([]);
      setQuantity(1);
    }
  }, [success]);

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={pizza.img} style={{ objectFit: "contain" }} fill alt="" />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price}</span>
        <p className={styles.desc}>{pizza.desc}</p>
        <h3 className={styles.choose}>Choose the size</h3>
        <div className={styles.sizes}>
          <div className={styles.outersize} onClick={() => handleSize(0)}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={size === 0}
              onChange={() => {}}
            />
            <div className={styles.size}>
              <Image src="/img/size.png" alt="" width={30} height={30} />
              <span className={styles.number}>Small</span>
            </div>
          </div>
          <div className={styles.outersize} onClick={() => handleSize(1)}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={size === 1}
              onChange={() => {}}
            />
            <div className={styles.size}>
              <Image src="/img/size.png" width={40} height={40} alt="" />
              <span className={styles.number}>Medium</span>
            </div>
          </div>
          <div className={styles.outersize} onClick={() => handleSize(2)}>
            <div>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={size === 2}
                onChange={() => {}}
              />
            </div>
            <div className={styles.size}>
              <Image src="/img/size.png" width={50} height={50} alt="" />
              <span className={styles.number}>Large</span>
            </div>
          </div>
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {pizza.extraOptions.map((option) => (
            <div className={styles.option} key={option._id}>
              <input
                type="checkbox"
                id={option.text}
                name={option.text}
                className={styles.checkbox}
                onChange={(e) => handleChange(e, option)}
              />
              <label htmlFor="double">{option.text}</label>
            </div>
          ))}
        </div>
        <div className={styles.add}>
          <input
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            defaultValue={1}
            className={styles.quantity}
          />
          <button className={styles.button} onClick={handleClick}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/products/${params.id}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return {
      props: {
        pizza: res.data.product,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default Product;
