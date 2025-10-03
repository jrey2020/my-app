import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Menu() {
    const navigate = useNavigate();
    const { cart, addToCart, removeFromCart } = useContext(CartContext); // ✅ use context

    const items = [
        { name: "Cookies", price: Math.floor(Math.random() * 5) + 1 },
        { name: "Soda", price: Math.floor(Math.random() * 3) + 1 },
        { name: "Cakes", price: Math.floor(Math.random() * 8) + 2 },
        { name: "Donuts", price: Math.floor(Math.random() * 4) + 1 },
        { name: "Milkshakes", price: Math.floor(Math.random() * 6) + 2 },
    ];

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Menu</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {items.map((item, index) => (
                    <li key={index} style={{ margin: "10px" }}>
                        {item.name} - ${item.price}
                        <button
                            style={{ marginLeft: "10px" }}
                            onClick={() => addToCart(item)} // ✅ uses context
                        >
                            Add
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Shopping Bag</h3>
            {cart.length === 0 ? (
                <p>No items yet</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {cart.map((item, i) => (
                        <li key={i}>
                            {item.name} - ${item.price}{" "}
                            <button
                                style={{ marginLeft: "10px" }}
                                onClick={() => removeFromCart(i)} // ✅ uses context
                            >
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <h3>Total: ${total}</h3>

            {cart.length > 0 && (
                <button onClick={() => navigate("/checkout")}>
                    Purchase Items
                </button>
            )}
        </div>
    );
}

export default Menu;
