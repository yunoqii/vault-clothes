import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../lib/apiFetch'

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const response = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        localStorage.setItem("token", data.token);
        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />
            <button>Login</button>
            <p>No account? <Link to="/register">Register</Link></p>
        </form>
    );
}

export default Login
