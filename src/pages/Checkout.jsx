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

            const res = await fetch(`${API_BASE}/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountInCents }),
            });
            const { clientSecret } = await res.json();

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });

            if (error) {
                alert(error.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
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
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
            <h2>Checkout</h2>

            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
            <input name="zip" placeholder="Zip" value={form.zip} onChange={handleChange} />

            {/* ✅ Styled Stripe Card Input */}
            <div
                style={{
                    marginTop: "20px",
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#fafafa",
                }}
            >
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#32325d",
                                '::placeholder': { color: "#aab7c4" },
                            },
                            invalid: { color: "#fa755a" },
                        },
                    }}
                />
            </div>

            <button
                onClick={handlePurchase}
                disabled={loading || !stripe}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#6772e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
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
