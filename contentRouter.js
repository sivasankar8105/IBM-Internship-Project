import { assistantEvaluator, assistantResponse, fetchAssignment, fetchFlashcard, fetchImportant, fetchLearningPlan, updateLastScore } from "../controller/contentController.js";
import express from "express";
import { requireAuth } from "@clerk/express";

const contentRouter = express.Router();

contentRouter.post("/flashcards",fetchFlashcard);
contentRouter.post("/imp",fetchImportant);
contentRouter.post("/assignment",fetchAssignment);
contentRouter.post("/assistant",assistantResponse);
contentRouter.post("/evaluator",assistantEvaluator);
contentRouter.post("/learningplan",fetchLearningPlan);
contentRouter.post("/updatescore",requireAuth(),updateLastScore);



export {contentRouter};