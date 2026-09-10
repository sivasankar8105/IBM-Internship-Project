import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    userId : {type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    role : {type:String,required:true},
    lastScore : {type:String,required:true}
    

})

const userModel = mongoose.model("user",userSchema) || mongoose.models.user;

export{userModel}