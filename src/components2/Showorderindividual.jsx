import React, { useContext, useState, useEffect } from "react";
import styles from "./showIndividualorder.module.css";
import { toast } from "react-toastify";
import { Appcontext } from "../context/Appcontext";
import axios from "axios";
import Loading from "../components/Loading";

const Showorderindividual = ({ item }) => {
  const { backendUrl, getorderdata, productData } = useContext(Appcontext);

  const [status, setStatus] = useState(item.status); // sync with order status
  const [load, setLoad] = useState(false);

  async function handleClick(e) {
    e.preventDefault();
    setLoad(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/order/changeOrderStatus",
        { orderId: item._id, status }
      );

      if (data.success) {
        toast.success(data.message);
        getorderdata();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoad(false);
    }
  }

  return (
    <div className={styles.orderContainer}>
      {load && <Loading status="Changing status" />}

      <div><strong>Purchaser:</strong> {item.name}</div>
      <div><strong>Email:</strong> {item.email}</div>
      <div><strong>Current Status:</strong> {item.status}</div>
      <div><strong>Order placed on: {item.createdAt}</strong></div>
      {/* ORDER ITEMS */}
      <div className={styles.orderItems}>
        <strong>Order Items:</strong>

        {item.orderData.map((prod, index) => {
          const product = productData.find(
            (p) => p._id === prod.productId
          );

          return (
            <div key={index} className={styles.orderRow}>
              <span>
                {product ? product.name : "Product not found"}
              </span>
              <span>Qty: {prod.qty}</span>
            </div>
          );
        })}
      </div>

      {/* TOTAL PRICE */}
      <div className={styles.totalPrice}>
        Total Price: ₹ {item.price}
      </div>

      {/* STATUS CHANGE */}
      <legend>Change Order Status</legend>
      <select
        className={styles.statusSelect}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button className={styles.changeBtn} onClick={handleClick}>
        Change Status
      </button>
    </div>
  );
};

export default Showorderindividual;
