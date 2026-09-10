import { classModel } from "../model/classModel.js";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { contentModel } from "../model/contentModel.js";
import dotenv from "dotenv";
dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const createClassroom = async(req,res) => {
    try{
        const {name,mentorName,courseName,courseDuration} = req.body;
        const userId = req.auth.userId;
    
        const classRoom = new classModel({
            userId:userId,
            name:name,
            mentorName:mentorName,
            courseName:courseName,
            courseDuration:courseDuration,
            
        
        })

        await classRoom.save();
        res.json({success:true,message:"Classroom created"})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const fetchClassroom = async(req,res) => {
    try{
        const userId = req.auth.userId;
        const classroom = await classModel.find({userId});
        res.json({success:true,classroom});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const addDocument = async(req,res) => {
    try{
        const {id,description,name} = req.body ; 
        const document = req.file; 
        if(document.size > 5*1024*1024){
            return res.json({success:false,message:"File size exceeds allowed size (5MB)."})
        }

        const databuffer = fs.readFileSync(document.path);
        const pdfData = await pdf(databuffer);
        const unique = uuidv4();

        await classModel.findByIdAndUpdate(id,{
            $push : {documents : {
                documentId: unique,
                name:name,
                description: description,
                documentText: pdfData.text

            }  }

        });
            
        const prompt = `You are an AI that generates personalized study materials and a learning plan from the given document.

From the document text, generate:

1. Flashcards
2. Quiz (MCQs with 4 options and correct answer index)
3. Important Questions
4. Learning Plan

STRICT RULES:
- Output ONLY valid JSON
- Do NOT include explanations or extra text outside the JSON
- Generate all content ONLY from the given document
- Do NOT invent information that is not present in the document
- Each quiz must have exactly 4 options
- correctAnswer MUST be the index (0,1,2,3)
- Ensure the correctAnswer index matches the correct option
- The learning plan must be organized in a logical study order
- The learning plan should help a student learn the document step-by-step
- Keep the learning plan simple and practical
- Each learning step must contain a topic, objective, and activity
- Do not make the learning plan unnecessarily long

JSON FORMAT:

{
  "flashcards": [
    {
      "question": "",
      "answer": ""
    }
  ],

  "quiz": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": 0
    }
  ],

  "importantQuestions": [
    {
      "question": ""
    }
  ],

  "learningPlan": [
    {
      "step": 1,
      "topic": "",
      "objective": "",
      "activity": ""
    }
  ]
}

LEARNING PLAN REQUIREMENTS:

The learningPlan should follow this general structure:

Step 1:
Start with the basic concepts and introduction of the document.

Step 2:
Study the important concepts and definitions.

Step 3:
Study the deeper concepts, processes, or relationships between topics.

Step 4:
Practice understanding using examples, questions, or applications from the document.

Step 5:
Review the complete topic using the important questions and flashcards.

If the document contains fewer or more major topics, adjust the number of steps accordingly.

DOCUMENT:
"""
${pdfData.text}
"""`;
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
        const cleaned = content.replace(/```json|```/g, "").trim();
        const json = JSON.parse(cleaned);

        const documentContent = new contentModel({
            classRoomId: id,
            documentId:unique,
            documentText: pdfData.text,
            content:json

        })

        await documentContent.save();

        res.json({success:true,message:"Documents Added and the content is generated"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const getClassroom = async(req,res) => {
    try{
        const classDocument = await classModel.find({});
        res.json({success:true,data:classDocument});

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const deleteClassroom = async(req,res) => {
   try{
    const {id} = req.body;
    await classModel.findByIdAndDelete(id);
    await contentModel.deleteMany({classRoomId:id});
    res.json({success:true,message:"Classroom deleted"});
   }
   catch(error){
    console.log(error);
    res.json({success:false,message:"Error"});
   }
    

}

const deleteDocument = async(req,res) => {
    try{
        const {id,doc} = req.body;
        await classModel.findByIdAndUpdate(id,{$pull:{documents:doc}});
        await contentModel.deleteMany({documentId:doc.documentId});
        res.json({success:true,message:"Document Deleted"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});

    }
    
}

export {createClassroom,fetchClassroom,getClassroom,addDocument,deleteClassroom,deleteDocument}