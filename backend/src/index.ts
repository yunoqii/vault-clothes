import express from "express";
import path from "path";
import "dotenv/config";
import authRouter from "./routes/auth.routes";
import postRouter from "./routes/post.routes";
import followRouter from "./routes/follow.routes";
import commentRouter from "./routes/comment.routes";
import listingRouter from "./routes/listing.routes";
import adminRouter from "./routes/admin.routes";
const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", followRouter);
app.use("/comments", commentRouter);
app.use("/listings", listingRouter);
app.use("/admin", adminRouter);



app.listen(Number(process.env.BACKEND_PORT), () => {
    console.log(`Server running on port ${process.env.BACKEND_PORT}`)
})
