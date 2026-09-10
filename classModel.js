import mongoose  from "mongoose";

const classSchema = new mongoose.Schema({
    userId : {type:String,required:true},
    name:{type:String,required:true},
    mentorName :{type:String,required:true},
    courseName : {type:String,required:true},
    courseDuration : {type:String,required:true},
    documents : {type:[Object],default:[],required:true}
})

const classModel = mongoose.model("class",classSchema) || mongoose.models.class;

export{classModel}