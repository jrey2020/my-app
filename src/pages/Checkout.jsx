import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51SFNrNDHQ9S6PqjANgCcyTbXQh3ZaYWlzSwsUU5iN1uICg7yx0G6ZbyZiQ06zoJVWBCfMd4EQeJ69doZ1kx9yQC300R8FU3HGd");

function CheckoutForm() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [form, setForm] = useState({ name: "", address: "", city: "", zip: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePurchase = async () => {
        if (!stripe || !elements) return;
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setLoading(true);

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const amountInCents = Math.round(total * 100);

        try {
            const API_BASE =
                import.meta.env.MODE === "development"
                    ? "http://localhost:5000"
                    : "https://robot-backend-ywcd.onrender.com";

            // Step 1: Create PaymentIntent
            const res = await fetch(`${API_BASE}/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountInCents }),
            });
            const { clientSecret } = await res.json();

            // Step 2: Confirm payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });

            if (error) {
                alert(error.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                // Step 3: Save order
                const order = {
                    customer: form.name,
                    address: form.address,
                    city: form.city,
                    zip: form.zip,
                    items: cart,
                    total,
                };

                const orderRes = await fetch(`${API_BASE}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(order),
                });

                const data = await orderRes.json();
                alert(`✅ Payment successful!\nOrder ID: ${data.id}`);
                clearCart();
                navigate("/");
            }
        } catch (err) {
            console.error("❌ Error:", err);
            alert("Error processing payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
            <input name="zip" placeholder="Zip" value={form.zip} onChange={handleChange} />

            <div style={{ margin: "20px 0" }}>
                <CardElement />
            </div>

            <button onClick={handlePurchase} disabled={loading || !stripe}>
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
}

export default function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
