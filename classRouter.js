import express from "express";
import { requireAuth } from "@clerk/express";
import { addDocument, createClassroom, deleteClassroom, deleteDocument, fetchClassroom, getClassroom } from "../controller/classController.js";
import multer from "multer"


const classRouter = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename : (req,file,cb) => {
        return cb(null, `${Date.now()+file.originalname}`);
    }
});
const uploads = multer({storage});

classRouter.post("/create-classroom",requireAuth(),createClassroom);
classRouter.get("/fetch-classroom",requireAuth(),fetchClassroom);
classRouter.post("/add-document",uploads.single("document"),addDocument);
classRouter.post("/delete-class",deleteClassroom);
classRouter.post("/delete-document",deleteDocument);
classRouter.get("/all",getClassroom)


export{classRouter}