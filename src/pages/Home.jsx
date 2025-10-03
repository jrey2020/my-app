import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Delivery Robot App</h1>
            <button onClick={() => navigate("/menu")}>
                Go to Menu
            </button>
        </div>
    );
}

export default Home;
