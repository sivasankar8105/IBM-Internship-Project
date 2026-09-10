import { userModel } from "../model/userModel.js";
import { clerkClient } from "@clerk/express";




const setRole = async(req,res) => {

    try{
        const {role} = req.body;
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: role
            }
        });

        const user = await clerkClient.users.getUser(userId);

        const name = user.firstName;
        const email = user.emailAddresses[0].emailAddress;

        const exists = await userModel.findOne({userId});
        if(exists){
            return res.json({success:false,message:"User Already exists"});
        }

        if(role === "teacher"){
             const newUser = new userModel({
            userId :userId,
            name:name,
            email:email,
            role:role,
            lastScore:"0"
        })
        await newUser.save();
        }

        else{
             const newUser = new userModel({
            userId :userId,
            name:name,
            email:email,
            role:role,
            lastScore:"0"
        })
        await newUser.save();
        }

       

        
        res.json({success:true,message:"Registered Successfully"});
    }   
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {setRole};