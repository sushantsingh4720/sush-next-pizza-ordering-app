import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import { LogoutBtn } from "./LogoutBtn";

const Navbar = () => {
  const {user}=useSelector(state=>state.user)
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.callButton}>
          <Image src="/img/telephone.png" alt="" width="32" height="32" />
        </div>
        <div className={styles.texts}>
          <div className={styles.text}>ORDER NOW!</div>
          <div className={styles.text}>+91 7991597674</div>
        </div>
      </div>
      <div className={styles.item}>
        <ul className={styles.list}>
          <Link href="/" passHref >
            <li className={styles.listItem}>Homepage</li>
          </Link>
          <Link href='/products' passHref>
          <li className={styles.listItem}>Products</li>
          </Link>
          <li className={styles.listItem}>Menu</li>
          {/* <Image src="/img/logo.png" alt=""  width={160} height={69} /> */}
          <li className={styles.listItem}>Events</li>
          <li className={styles.listItem}>Blog</li>
          <li className={styles.listItem}>Contact</li>
          {user.isSeller&&<Link href='/admin' passHref>
          <li className={styles.listItem}>Admin</li>
          </Link>}
          {user&&user.isSeller===false&&<Link href='/orders' passHref>
          <li className={styles.listItem}>orders</li>
          </Link>}
        </ul>
      </div>
      <LogoutBtn/>
    </div>
  );
};

export default Navbar;
