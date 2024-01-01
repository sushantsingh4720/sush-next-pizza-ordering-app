import { useEffect, useState } from "react";
import styles from "../../styles/Admin.module.css";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";

import { useRouter } from "next/router";
import { parse } from "cookie";
import Link from "next/link";

const Orders = ({ orders }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  const router = useRouter();

  const status = ["preparing", "on the way", "delivered"];

  useEffect(() => {
    if (!isAuthenticated && loading === false) {
      router.push("/login");
    }
  }, [isAuthenticated, loading]);

  if (loading || loading === undefined) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Orders</h1>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Id</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </tbody>
          {orders?.map((order) => (
            <tbody key={order._id}>
              <tr className={styles.trTitle}>
                <td>{order._id.slice(0, 5)}...</td>
                <td>{order.userId.slice(0, 5)}...</td>
                <td>${order.total}</td>
                <td>
                  {order.method === 0 ? <span>cash</span> : <span>paid</span>}
                </td>
                <td>{status[order.status]}</td>
                <td>
                  <Link
                    href={`/orders/${order._id}`}
                    passHref
                    className={styles.linkButton}
                  >
                    View Order
                  </Link>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Orders;

export const getServerSideProps = async ({ req }) => {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) {
      return {
        redirect: {
          destination: "/login",
        },
      };
    }
    const orderResponse = await fetch(`${process.env.URL}/api/orders`, {
      cache: "no-store",
      headers: {
        cookie: `token=${token}`,
      },
    });
    const orderRes = await orderResponse.json();
    return {
      props: {
        orders: orderRes.orders,
      },
    };
  } catch (error) {}
};
