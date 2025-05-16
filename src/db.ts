import mongoose, { model } from "mongoose";
import {Model,Schema} from "mongoose";


const userschema=new Schema({
    name:{type:String},
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})
const contentschema=new Schema({
    title:{type:String},
    link:{type:String},
    tag:[{type:mongoose.Types.ObjectId,ref: 'Tag'}],
    user:{type:mongoose.Types.ObjectId,ref:'User',require:true}
})

export const User = model('User',userschema);
export const Content=model('Content',contentschema)