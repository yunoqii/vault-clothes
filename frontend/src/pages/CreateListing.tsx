import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../lib/apiFetch'

function CreateListing() {
    const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });
    const [files, setFiles] = useState<FileList | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        // multipart/form-data, not JSON — required because we're sending
        // binary image files alongside text fields. FormData builds the
        // right body shape; apiFetch skips the JSON Content-Type for it
        // automatically so the browser can set its own multipart boundary.
        const body = new FormData();
        body.append("title", form.title);
        body.append("description", form.description);
        body.append("price", form.price);
        body.append("category", form.category);

        if (files) {
            for (const file of files) {
                body.append("images", file);
            }
        }

        const response = await apiFetch("/listings", {
            method: "POST",
            body,
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error ?? "Failed to create listing");
            return;
        }

        navigate(`/listings/${data.id}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sell an item</h1>
            {error && <p>{error}</p>}
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
            />
            <button>Create listing</button>
        </form>
    );
}

export default CreateListing
