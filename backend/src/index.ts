import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);



app.listen(Number(process.env.BACKEND_PORT), () => {
    console.log(`Server running on port ${process.env.BACKEND_PORT}`)
})