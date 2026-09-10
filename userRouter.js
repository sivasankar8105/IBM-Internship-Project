import express from "express";
import { requireAuth } from "@clerk/express";
import { setRole } from "../controller/userController.js";


const userRouter = express.Router();



userRouter.post("/set-role",requireAuth(),setRole);


export{userRouter}