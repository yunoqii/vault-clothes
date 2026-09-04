import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../lib/apiFetch'

function Register() {
    const [form, setForm] = useState({ email: "", username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const response = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        navigate("/login");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            {error && <p>{error}</p>}
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />
            <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />
            <button>Register</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
    );
}

export default Register
