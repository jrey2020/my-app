import { createContext, useState } from "react";

// ✅ Create the context
export const CartContext = createContext();

// ✅ Create a provider component
export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => setCart([...cart, item]);
    const removeFromCart = (index) =>
        setCart(cart.filter((_, i) => i !== index));
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
