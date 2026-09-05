import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
    sellerId: string;
    images: ListingImage[];
}

function ListingDetail() {
    const { listingId } = useParams();
    const [listing, setListing] = useState<Listing | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            const response = await apiFetch(`/listings/${listingId}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? "Listing not found");
                return;
            }

            setListing(data);
        };

        load();
    }, [listingId]);

    if (error) return <p>{error}</p>;
    if (!listing) return <p>Loading...</p>;

    return (
        <div>
            <p><Link to="/listings">Back to listings</Link></p>
            <h1>{listing.title}</h1>
            <p>${listing.price} — {listing.status}</p>
            {listing.category && <p>Category: {listing.category}</p>}
            <p>{listing.description}</p>
            <div>
                {listing.images.map((image) => (
                    <img key={image.id} src={image.url} alt={listing.title} width={200} />
                ))}
            </div>
        </div>
    );
}

export default ListingDetail
