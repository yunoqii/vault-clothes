import { Link, useNavigate } from 'react-router-dom'

function Nav() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!token) {
        return (
            <nav>
                <Link to="/">Vault Clothes</Link>
                {" | "}
                <Link to="/login">Login</Link>
                {" | "}
                <Link to="/register">Register</Link>
            </nav>
        );
    }

    return (
        <nav>
            <Link to="/">Vault Clothes</Link>
            {" | "}
            <Link to="/feed">Feed</Link>
            {" | "}
            <Link to="/listings">Listings</Link>
            {" | "}
            <Link to="/listings/new">Sell an item</Link>
            {" | "}
            <Link to="/profile">Profile</Link>
            {" | "}
            <Link to="/chat">Chat</Link>
            {" | "}
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Nav
