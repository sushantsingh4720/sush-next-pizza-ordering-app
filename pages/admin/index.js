import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../../styles/Admin.module.css";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { parse } from "cookie";
import { useDispatch } from "react-redux";
import { getAllProduct } from "../../redux/productSlice";

const Admin = ({ orders, products }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  const router = useRouter();
  const dispatch = useDispatch();
  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const status = ["preparing", "on the way", "delivered"];

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(`/api/products/admin/delete/${id}`);
      const res = response.data;
      if (res.success) {
        toast.success(res.message);
        setPizzaList(pizzaList.filter((pizza) => pizza._id !== id));
        dispatch(getAllProduct());
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Interval Server Error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatus = async (id) => {
    const item = orderList.filter((order) => order._id === id)[0];
    const currentStatus = item.status;
    setDeleteLoading(true);
    try {
      const response = await axios.patch(`/api/orders/admin/update/${id}`, {
        status: currentStatus + 1,
      });
      const res = response.data;
      if (res.success) {
        toast.success(res.message);
        setOrderList([
          res.updatedOrder,
          ...orderList.filter((order) => order._id !== id),
        ]);
      }
    } catch (err) {
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !user.isSeller && loading === false) {
      toast.error("Only admin can access this Page");
      router.push("/");
    }
  }, [isAuthenticated, user.isSeller, loading]);

  if (loading || loading === undefined || deleteLoading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Products</h1>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </tbody>
          {pizzaList?.map((product) => (
            <tbody key={product._id}>
              <tr className={styles.trTitle}>
                <td>
                  <Image
                    src={product.img}
                    width={50}
                    height={50}
                    objectFit="cover"
                    alt=""
                  />
                </td>
                <td>{product._id.slice(0, 5)}...</td>
                <td>{product.title}</td>
                <td>${product.prices[0]}</td>
                <td>
                  <button className={styles.button}>Edit</button>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
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
          {orderList?.map((order) => (
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
                  <button
                    onClick={() => handleStatus(order._id)}
                    disabled={order.status >= 2 && true}
                  >
                    Next Stage
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Admin;

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

    const productResponse = await fetch(
      `${process.env.URL}/api/products/admin`,
      {
        cache: "no-cache",
        headers: {
          cookie: `token=${token}`,
        },
      }
    );
    const orderResponse = await fetch(`${process.env.URL}/api/orders/admin`, {
      cache: "no-cache",
      headers: {
        cookie: `token=${token}`,
      },
    });

    const productRes = await productResponse.json();
    const orderRes = await orderResponse.json();

    return {
      props: {
        products: productRes.products,
        orders: orderRes.orders,
      },
    };
  } catch (error) {}
};
