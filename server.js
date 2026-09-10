import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDb from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { userRouter } from "./router/userRouter.js";
import { classRouter } from "./router/classRouter.js";
import { contentRouter } from "./router/contentRouter.js";



const app = express()
dotenv.config()

const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/",async(req,res)=>{
    res.send("Server is Live")
})

app.use("/api",userRouter);
app.use("/api",classRouter);
app.use("/api",contentRouter);

connectDb();

app.listen(PORT,()=>{
    console.log(`Server running on PORT http://localhost:${PORT}`);
})

