import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        address: "",
        city: "",
        zip: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePurchase = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);

        const order = {
            customer: form.name,
            address: form.address,
            city: form.city,
            zip: form.zip,
            items: cart,
        };

        try {
            // ✅ Use your live backend URL instead of localhost
            const res = await fetch("https://robot-backend-ywcd.onrender.com/orders", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });

            const data = await res.json();
            alert(`✅ Purchase complete!\n\nOrder ID: ${data.id}`);
            clearCart();

            // ✅ Redirect user to main page (menu)
            navigate("/");
        } catch (err) {
            console.error("Error posting order:", err);
            alert("Error completing purchase.");
        }
    };

    return (
        <div>
            <h2>Checkout</h2>

            <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
            />
            <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
            />
            <input
                type="text"
                name="zip"
                placeholder="Zip"
                value={form.zip}
                onChange={handleChange}
            />

            <button onClick={handlePurchase}>Complete Purchase</button>
        </div>
    );
}

export default Checkout;
