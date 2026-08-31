import { Router } from "express";
import { getAllUsers, banUser, changeUserRole, adminDeleteComment, adminDeleteListing } from "../controllers/admin.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/users", requireAuth, requireAdmin, getAllUsers);
router.patch("/users/:id/ban", requireAuth, requireAdmin, banUser);
router.patch("/users/:id/role", requireAuth, requireAdmin, changeUserRole);
router.delete("/comments/:id", requireAuth, requireAdmin, adminDeleteComment);
router.delete("/listings/:id", requireAuth, requireAdmin, adminDeleteListing);

export default router;
