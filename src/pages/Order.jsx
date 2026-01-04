import React, { useContext, useEffect, useState } from "react";
import NewNav from "../components/NewNav";
import { Appcontext } from "../context/Appcontext";
import styles from "../CSS/order.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Order = () => {
  const { cartData, getcartdata, productData, userData, getUserData,backendUrl } =
    useContext(Appcontext);
  const [total, setTotal] = useState(0);
  const [agree, setAgree] = useState(false);
  const [load,setLoad]=useState(false);
  useEffect(() => {
    if (!cartData || cartData.length === 0) {
      getcartdata();
    }
  }, []);

  useEffect(() => {
    if (!userData) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    let sum = 0;
    cartData.forEach((item) => {
      const product = productData.find((p) => p._id === item.productId);
      if (product) {
        sum += product.price * item.qty;
      }
    });
    setTotal(sum);
  }, [cartData, productData]);

  const shipping = 100;
  async function handleClick(e)
{
    e.preventDefault();
    setLoad(true);
    try{
      const newObj={
        name:userData.name,
        email:userData.email,
        price:total,
        orderData:cartData
      }
        const {data}=await axios.post(backendUrl+"/api/order/setOrder",newObj)
        if(data.success)
        {
          toast.success("Order Placed");
          setLoad(false);
        }
        else{
          toast.error(data.message);
          setLoad(false);
        }
    }catch(err)
    {
      toast.error(err.message);
      setLoad(false);
    }
}




  return (
    <div>
      <NewNav />
      {load ? <Loading status="Placing Your Order"/> : null}
      {/* Purchaser Info */}
      <div className={styles.purchaserBox}>
        <h3>Purchaser Information</h3>
        <p>
          <strong>Name:</strong> {userData?.name}
        </p>
        <p>
          <strong>Email:</strong> {userData?.email}
        </p>
      </div>

      {/* Cart Items */}
      <div className={styles.itemsBox}>
        <h3>Order Items</h3>

        {cartData.map((item) => {
          const product = productData.find((p) => p._id === item.productId);
          if (!product) return null;

          return (
            <div className={styles.itemRow} key={item.productId}>
              <span className={styles.itemName}>{product.name}</span>
              <span className={styles.itemQty}>Qty: {item.qty}</span>
            </div>
          );
        })}
      </div>
      {/* money table */}
      <div className={styles.totalBox}>
        <h3>CART TOTALS</h3>

        <div className={styles.row}>
          <span>Subtotal</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>

        <div className={styles.row}>
          <span>Shipping Fee</span>
          <span>₹ {shipping.toFixed(2)}</span>
        </div>

        <div className={`${styles.row} ${styles.final}`}>
          <span>Total</span>
          <span>₹ {(total + shipping).toFixed(2)}</span>
        </div>
      </div>

      {/* form for submitting address */}
      <form>
        <div className={styles.head}>Enter Address Details</div>
        <div className={styles.address}>
          <div className={styles.sub}>
            <input
              type="text"
              required
              placeholder="First Name"
              className={styles.s1}
            />
            <input
              type="text"
              required
              placeholder="Last Name"
              className={styles.s1}
            />
          </div>
          <input type="email" required placeholder="Email Address" />
          <div className={styles.sub}>
            <input
              type="text"
              required
              placeholder="State"
              className={styles.s1}
            />
            <input
              type="text"
              required
              placeholder="City"
              className={styles.s1}
            />
          </div>
          <div className={styles.sub}>
            <input
              type="text"
              required
              placeholder="Street"
              className={styles.s1}
            />
            <input
              type="number"
              required
              placeholder="ZipCode"
              className={styles.s1}
            />
          </div>
          <input type="number" required placeholder="Phone no." />
          <div className={styles.termsBox}>
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span>
                I agree to the <strong>Terms & Conditions</strong> and
                <strong> Privacy Policy</strong> <strong style={{"color":"green"}}>Cash on Delivery</strong>
              </span>
            </label>
          </div>

          <button className={styles.placeOrderBtn} type="submit" disabled={!agree && !load} onClick={(e)=>handleClick(e)}>
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Order;
