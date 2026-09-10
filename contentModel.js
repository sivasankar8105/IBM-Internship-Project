import mongoose  from "mongoose";

const contentSchema = new mongoose.Schema({
    classRoomId : {type:String,required:true},
    documentId:{type:String,required:true},
    documentText:{type:String,required:true},
    content : {type:Object,required:true}
})

const contentModel = mongoose.model("content",contentSchema) || mongoose.models.content;

export{contentModel}