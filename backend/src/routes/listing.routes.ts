import { Router } from "express";
import { createListing, getListings, getListing, updateListing, deleteListing } from "../controllers/listing.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../lib/upload";

const router = Router();

const MAX_LISTING_IMAGES = 5;

router.post("/", requireAuth, upload.array("images", MAX_LISTING_IMAGES), createListing);
router.get("/", getListings);
router.get("/:listingId", getListing);
router.patch("/:listingId", requireAuth, updateListing);
router.delete("/:listingId", requireAuth, deleteListing);

export default router;
