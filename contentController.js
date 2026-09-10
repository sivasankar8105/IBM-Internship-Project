import { contentModel } from "../model/contentModel.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { userModel } from "../model/userModel.js";
dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


const fetchFlashcard = async (req, res) => {
  try{
        const {documentId} = req.body;
        const contentDocument = await contentModel.findOne({documentId});
        const flashresponse = contentDocument.content.flashcards;
        res.json({success:true,data:flashresponse});
    }
    catch(error){
        res.json({success:false,message:"Error"});
    }
};

const fetchAssignment = async(req,res)=> {
    try{
        const {documentId} = req.body;
        const contentDocument = await contentModel.findOne({documentId});
        const quiz = contentDocument.content.quiz;
        res.json({success:true,data:quiz});
    }
    catch(error){
        res.json({success:false,message:"Error"});
    }
}
const fetchLearningPlan = async(req,res)=> {
    try{
        const {documentId} = req.body;
        const contentDocument = await contentModel.findOne({documentId});
        const learningPlan = contentDocument.content.learningPlan;
        res.json({success:true,data:learningPlan});
    }
    catch(error){
        res.json({success:false,message:"Error"});
    }
}

const fetchImportant = async(req,res)=> {
    try{
        const {documentId} = req.body;
        const contentDocument = await contentModel.findOne({documentId});
        const important = contentDocument.content.importantQuestions;
        res.json({success:true,data:important});
    }
    catch(error){
        res.json({success:false,message:"Error"});
    }
}

const updateLastScore = async(req,res) => {
    try{
         const userId = req.auth.userId;
         const {score,total} = req.body;
         const lastScore = score.toString();
         const lastTotal = total.toString();
         await userModel.findOneAndUpdate({userId},{lastScore:lastScore+"/"+lastTotal});
         res.json({success:true,message:"Score Updated"})

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const assistantResponse = async(req,res) => {
    try{
        const {documentId,input} = req.body;
        const document = await contentModel.findOne({documentId:documentId});


const text = document.documentText;

        const prompt = `You are an AI assistant that answers questions based ONLY on the provided document.

INSTRUCTIONS:
- Answer the user's question using ONLY the information from the document
- Do NOT use outside knowledge
- If the answer is not found in the document, say:
  "Answer not found in the provided document"
- Keep the answer clear and concise
- Use simple language

DOCUMENT:
"""
${text}
"""

QUESTION:
"${input}"

ANSWER:`

         const response = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
            {
                role: "user",
                content: prompt,
            },
        ],  
        temperature:0.7
        });
        const content = response.choices[0].message.content;
        res.json({success:true,data:content});

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const assistantEvaluator = async(req,res) => {
    try{
        const {documentId,text,mode} = req.body;
        const document = await contentModel.findOne({documentId:documentId});
        const documentText = document.documentText;


        const prompt = `You are an intelligent academic evaluator.


INPUTS:
OCR TEXT:
${text}

REFERENCE DOCUMENT:
${documentText}

DIFFICULTY MODE:
${mode}

TASK:

Step 1: Clean & Correct OCR Text

* Fix spelling mistakes caused by OCR errors.
* Correct broken words, spacing issues, and obvious misrecognitions.
* Do NOT change the meaning of the student’s answer.
* Preserve the original intent.

Step 2: Understand the Answer

* Interpret the corrected student answer.
* Identify key concepts, keywords, and explanations.

Step 3: Evaluate Against Reference (documentText)

* Compare the student’s answer with the reference content.
* Check for:

  * Concept correctness
  * Completeness
  * Relevance
  * Missing key points

Step 4: Apply Difficulty Mode

EASY:

* Be lenient.
* Accept partially correct answers.
* Focus on core idea being present.

MEDIUM:

* Moderate strictness.
* Require key concepts and reasonable explanation.

HARD:

* Strict evaluation.
* Require accuracy, completeness, and proper explanation.
* Penalize missing details.

Step 5: Scoring

* Provide a score out of 10.
* Justify the score clearly.

Step 6: Feedback

* Give constructive feedback:

  * What is correct
  * What is missing
  * What can be improved

OUTPUT FORMAT (STRICT):

correctedText: <Cleaned and corrected version of OCR text>

score: <number out of 10>

evaluation: <Detailed explanation of correctness>

missingPoints:

* <point 1>
* <point 2>

strengths:

* <point 1>
* <point 2>

improvements:

* <suggestion 1>
* <suggestion 2>

if the answer is not relevant answer say it's is not relevant to the document.
`

         const response = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
            {
                role: "user",
                content: prompt,
            },
        ],  
        temperature:0.7
        });
        const content = response.choices[0].message.content;
        res.json({success:true,data:content});

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}



export {fetchFlashcard,fetchAssignment,fetchImportant,assistantResponse,assistantEvaluator,fetchLearningPlan,updateLastScore}