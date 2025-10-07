import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./styles/index.css";

// ✅ Load Stripe.js dynamically if not already loaded
function loadStripeScript() {
    return new Promise((resolve, reject) => {
        if (window.Stripe) {
            resolve(window.Stripe);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.async = true;
        script.onload = () => resolve(window.Stripe);
        script.onerror = () => reject(new Error("Stripe.js failed to load"));
        document.body.appendChild(script);
    });
}

function RootApp() {
    useEffect(() => {
        loadStripeScript().then(() => console.log("✅ Stripe.js loaded in React"));
    }, []);

    return (
        <React.StrictMode>
            <CartProvider>
                <App />
            </CartProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<RootApp />);
