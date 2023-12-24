import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/LogoutBtn.module.css";
import { logoutUser ,loggedInUser} from "../redux/userSlice";
import { useEffect } from "react";
import { getAllProduct } from "../redux/productSlice";
export const LogoutBtn = () => {

  const { isAuthenticated } = useSelector((state) => state.user);

  const { quantity } = useSelector((state) => state.cart);

  const dispatch=useDispatch()
  
  const logoutHandler = async () => {
     dispatch(logoutUser())
  };


  useEffect(()=>{
      dispatch(loggedInUser())
      dispatch(getAllProduct())
  },[])


  return isAuthenticated ? (
    <>
      <Link href="/cart" passHref>
        <div className={styles.item}>
          <div className={styles.cart}>
            <Image src="/img/cart.png" alt="" width={30} height={30} />
            <div className={styles.counter}>{quantity}</div>
          </div>
        </div>
      </Link>
      <button className={styles.btn} onClick={logoutHandler}>
        Logout
      </button>
    </>
  ) : (
    <Link className={styles.btn} href={"/login"}>Login</Link>
  );
};
