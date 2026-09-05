import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/apiFetch'

interface Post {
    id: string;
    title: string | null;
    caption: string;
    imageUrl: string | null;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
}

function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFeed = async () => {
            const response = await apiFetch("/posts");
            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? "Failed to load feed");
                setLoading(false);
                return;
            }

            setPosts(data.posts);
            setLoading(false);
        };

        loadFeed();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (posts.length === 0) return <p>Your feed is empty — follow someone to see their posts.</p>;

    return (
        <div>
            <h1>Feed</h1>
            {posts.map((post) => (
                <div key={post.id}>
                    <p><strong>{post.author.username}</strong></p>
                    {post.title && <h3>{post.title}</h3>}
                    {post.imageUrl && <img src={post.imageUrl} alt={post.title ?? "post"} />}
                    <p>{post.caption}</p>
                </div>
            ))}
        </div>
    );
}

export default Feed
