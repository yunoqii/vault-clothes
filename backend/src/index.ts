import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.routes";
import postRouter from "./routes/post.routes";
import followRouter from "./routes/follow.routes";
const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", followRouter);



app.listen(Number(process.env.BACKEND_PORT), () => {
    console.log(`Server running on port ${process.env.BACKEND_PORT}`)
})