import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import styles from "../styles/LogoutBtn.module.css";
export const LogoutBtn = () => {
  const { user } = useSelector((state) => state.user);
  const { quantity } = useSelector((state) => state.cart);
  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/logout");

      const data = await res.json();

      if (!data.success) toast.error(data.message);

      setUser({});

      toast.success(data.message);
    } catch (error) {
      return toast.error(error);
    }
  };

  return user._id ? (
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
