import mongoose, { model } from "mongoose";
import {Model,Schema} from "mongoose";


const userschema=new Schema({
    name:{type:String},
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})


export const User = model('User',userschema);