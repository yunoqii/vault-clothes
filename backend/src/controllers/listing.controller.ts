import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const createListing = async (req: Request, res: Response) => {
    const { title, description, price, category, images } = req.body;

    if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "invalid price entered" });
    }

    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            price,
            category,
            sellerId: req.userId as string,
            images: {
                create: Array.isArray(images)
                    ? images.map((url: string) => ({ url }))
                    : [],
            },
        },
        include: {
            images: true,
        },
    });

    return res.status(201).json(listing);
}

const DEFAULT_LISTINGS_LIMIT = 10;
const MAX_LISTINGS_LIMIT = 50;

export const getListings = async (req: Request, res: Response) => {
    const { cursor, limit, category } = req.query;

    let take = DEFAULT_LISTINGS_LIMIT;
    if (typeof limit === "string") {
        const parsedLimit = Number(limit);
        if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
            take = Math.min(parsedLimit, MAX_LISTINGS_LIMIT);
        }
    }

    const listings = await prisma.listing.findMany({
        where: {
            status: "active",
            ...(typeof category === "string" ? { category } : {}),
        },
        take,
        orderBy: { createdAt: "desc" },
        include: {
            images: true,
        },
        ...(typeof cursor === "string"
            ? { skip: 1, cursor: { id: cursor } }
            : {}),
    });

    const nextCursor = listings.length === take ? listings[listings.length - 1]!.id : null;

    return res.status(200).json({ listings, nextCursor });
};

export const getListing = async (req: Request, res: Response) => {
    const { listingId } = req.params;

    if (typeof listingId !== "string") {
        return res.status(400).json({ error: "invalid listingId" });
    }

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
            images: true,
        },
    });

    if (!listing) {
        return res.status(404).json({ error: "listing not found" });
    }

    return res.status(200).json(listing);

}

const ALLOWED_LISTING_STATUSES = ["active", "sold", "hidden", "NFS"];

export const updateListing = async (req: Request, res: Response) => {
    const { title, description, price, category, status } = req.body;
    const { listingId } = req.params;

    if (typeof listingId !== "string") {
        return res.status(400).json({ error: "invalid listing id" });
    }

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
        return res.status(400).json({ error: "invalid price entered" });
    }

    if (status !== undefined && !ALLOWED_LISTING_STATUSES.includes(status)) {
        return res.status(400).json({ error: "invalid status" });
    }

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
    });

    if (!listing) {
        return res.status(404).json({ error: "listing not found" });
    }

    if (listing.sellerId !== (req.userId as string)) {
        return res.status(403).json({ error: "you are not the seller of this listing" });
    }

    const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: { title, description, price, category, status },
        include: { images: true },
    });

    return res.status(200).json(updatedListing);
};

export const deleteListing = async (req: Request, res: Response) => {
    const { listingId } = req.params;

    if (typeof listingId !== "string") {
        return res.status(400).json({ error: "invalid listing id" });
    }

    const result = await prisma.listing.deleteMany({
        where: {
            id: listingId,
            sellerId: req.userId as string,
        },
    });

    if (result.count === 1) {
        return res.status(204).send();
    }

    return res.status(404).json({ error: "listing not found" });
};