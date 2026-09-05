import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from '../lib/apiFetch'

interface UserProfile {
    id: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    bannerUrl: string | null;
    createdAt: string;
    _count: {
        followers: number;
        following: number;
        posts: number;
    };
}

function Profile() {
    const { username: routeUsername } = useParams();
    const [searchInput, setSearchInput] = useState(routeUsername ?? "");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState("");
    const [followStatus, setFollowStatus] = useState("");

    const loadProfile = async (username: string) => {
        setError("");
        setProfile(null);
        setFollowStatus("");

        const response = await apiFetch(`/users/${username}`);
        const data = await response.json();

        if (!response.ok) {
            setError(data.error ?? "User not found");
            return;
        }

        setProfile(data);
    };

    // Re-run the search whenever the URL param changes (e.g. clicking
    // an author's username elsewhere navigates here with a new username).
    useEffect(() => {
        if (routeUsername) {
            loadProfile(routeUsername);
        }
    }, [routeUsername]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchInput.trim()) {
            loadProfile(searchInput.trim());
        }
    };

    const handleFollow = async () => {
        if (!profile) return;
        const response = await apiFetch(`/users/${profile.id}/follow`, { method: "POST" });

        if (response.status === 201) {
            setFollowStatus("Now following.");
        } else if (response.status === 409) {
            setFollowStatus("Already following.");
        } else {
            const data = await response.json();
            setFollowStatus(data.error ?? "Could not follow this user.");
        }
    };

    const handleUnfollow = async () => {
        if (!profile) return;
        const response = await apiFetch(`/users/${profile.id}/follow`, { method: "DELETE" });

        if (response.status === 204) {
            setFollowStatus("Unfollowed.");
        } else {
            const data = await response.json();
            setFollowStatus(data.error ?? "Could not unfollow this user.");
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            <form onSubmit={handleSearch}>
                <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by username"
                />
                <button>Search</button>
            </form>

            {error && <p>{error}</p>}

            {profile && (
                <div>
                    <h2>{profile.username}</h2>
                    {profile.bio && <p>{profile.bio}</p>}
                    <p>
                        {profile._count.posts} posts · {profile._count.followers} followers · {profile._count.following} following
                    </p>
                    <button onClick={handleFollow}>Follow</button>
                    <button onClick={handleUnfollow}>Unfollow</button>
                    {followStatus && <p>{followStatus}</p>}
                    <p><Link to="/feed">Back to feed</Link></p>
                </div>
            )}
        </div>
    );
}

export default Profile
