import express from "express";
import "dotenv/config";

const app = express();

app.listen(Number(process.env.BACKEND_PORT), () => {
    console.log(`Server running on port ${process.env.BACKEND_PORT}`)
})