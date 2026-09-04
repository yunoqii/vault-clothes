import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h1>Vault Clothes</h1>
            {token ? (
                <>
                    <p>You are logged in.</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
}

export default Home
