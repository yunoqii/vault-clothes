import { Router } from "express";
import { createListing, getListings, getListing, updateListing, deleteListing } from "../controllers/listing.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createListing);
router.get("/", getListings);
router.get("/:listingId", getListing);
router.patch("/:listingId", requireAuth, updateListing);
router.delete("/:listingId", requireAuth, deleteListing);

export default router;
