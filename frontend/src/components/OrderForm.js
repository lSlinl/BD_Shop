import React, { useState } from "react";
import api from "../api/api";

function OrderForm() {
  const [address, setAddress] = useState("");
  const [comments, setComments] = useState("");

  const submitOrder = async () => {
    await api.post("/orders/create/", { address, comments });
    alert("Order submitted!");
  };

  return (
    <div>
      <h2>Checkout</h2>
      <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
      <textarea placeholder="Comments" value={comments} onChange={e => setComments(e.target.value)} />
      <button onClick={submitOrder}>Submit Order</button>
    </div>
  );
}

export default OrderForm;
