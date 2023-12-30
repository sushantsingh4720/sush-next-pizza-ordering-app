import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import axios from "axios";
import { useRouter } from "next/router";
import {
  getAllCart,
  removeProductInCart,
  reset,
  resetAddCart,
} from "../redux/cartSlice";
import OrderDetail from "../components/OrderDetail";
import Loading from "../components/Loading";
import { createOrder, resetAddOrder } from "../redux/orderSlice";

const Cart = () => {
  const {
    cart,
    success,
    loading: cartLoading,
  } = useSelector((state) => state.cart);
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const { success: createOrderSuccess, loading: createOrderLoading } =
    useSelector((state) => state.order);

  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const amount = cart?.reduce((accumulator, product) => {
    return accumulator + amountCalculator(product);
  }, 0);
  const currency = "USD";
  const style = { layout: "vertical" };
  const dispatch = useDispatch();
  const router = useRouter();

  const createOrderHandler = async (data) => {
    dispatch(createOrder(data));
  };

  // Custom component to wrap the PayPalButtons and handle currency changes
  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrderHandler({
                address: shipping.address.address_line_1,
                total: amount,
                method: 1,
                cart: cart,
              });
            });
          }}
        />
      </>
    );
  };

  const handleRemove = (id) => {
    dispatch(removeProductInCart({ id }));
  };

  useEffect(() => {
    if (isAuthenticated === false && loading === false) router.push("/login");
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (success) {
      dispatch(resetAddCart());
      dispatch(getAllCart());
    }
  }, [success]);

  useEffect(() => {
    if (createOrderSuccess) {
      dispatch(resetAddOrder());
      dispatch(getAllCart())
    }
  }, [createOrderSuccess]);

  if (loading || cartLoading) {
    return <Loading />;
  }

  if (createOrderLoading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Product</th>
              <th>Name</th>
              <th>Extras</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th className={styles.lastthchild}>Remove</th>
            </tr>
          </tbody>
          <tbody>
            {cart.map((product, index) => (
              <tr className={styles.tr} key={product._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={product.productId.img}
                      fill
                      style={{ objectFit: "cover" }}
                      alt=""
                    />
                  </div>
                </td>
                <td>
                  <span className={styles.name}>{product.productId.title}</span>
                </td>
                <td>
                  <span className={styles.extras}>
                    {product.extras.map((extra) => (
                      <span key={extra._id}>{extra.text} </span>
                    ))}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>
                    $
                    {product.productId.prices[product.size] +
                      product.extras?.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.price;
                      }, 0)}
                  </span>
                </td>
                <td>
                  <span className={styles.quantity}>{product.quantity}</span>
                </td>
                <td>
                  <span className={styles.total}>
                    ${amountCalculator(product)}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.removebutton}
                    onClick={() => handleRemove(product._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>$
            {cart?.reduce((accumulator, product) => {
              return accumulator + amountCalculator(product);
            }, 0)}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>$
            {cart?.reduce((accumulator, product) => {
              return accumulator + amountCalculator(product);
            }, 0)}
          </div>
          {open ? (
            <div className={styles.paymentMethods}>
              <button
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                CASH ON DELIVERY
              </button>
              <PayPalScriptProvider
                options={{
                  "client-id":
                    "AR7nxRdxQ2cMqfodaituLSAC08A9Auo-YTkbmFy4vIwFZmbxL326ZWW_l1CiEfgtDhff7q_GWEOtkx52",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding": "credit,card,p24",
                }}
              >
                <ButtonWrapper currency={currency} showSpinner={false} />
              </PayPalScriptProvider>
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOUT NOW!
            </button>
          )}
        </div>
      </div>
      {cash && (
        <OrderDetail
          total={amount}
          cart={cart}
          createOrder={createOrderHandler}
          setCash={setCash}
        />
      )}
    </div>
  );
};

export default Cart;

function amountCalculator(product) {
  const value =
    (product.productId.prices[product.size] +
      (product.extras?.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price;
      }, 0) || 0)) *
    product.quantity;
  return value;
}
