import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/apiFetch'

interface ListingImage {
    id: string;
    url: string;
}

interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string | null;
    status: string;
    images: ListingImage[];
}

function Listings() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            const response = await apiFetch("/listings");
            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? "Failed to load listings");
                setLoading(false);
                return;
            }

            setListings(data.listings);
            setLoading(false);
        };

        load();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Listings</h1>
            <p><Link to="/listings/new">Sell an item</Link></p>
            {listings.length === 0 && <p>No listings yet.</p>}
            {listings.map((listing) => (
                <div key={listing.id}>
                    <Link to={`/listings/${listing.id}`}>
                        {listing.images[0] && <img src={listing.images[0].url} alt={listing.title} width={120} />}
                        <h3>{listing.title}</h3>
                    </Link>
                    <p>${listing.price}</p>
                </div>
            ))}
        </div>
    );
}

export default Listings
