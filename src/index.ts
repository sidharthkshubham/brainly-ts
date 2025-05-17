import express from "express";
import { Request, Response } from "express";
import { User,Content } from "./db";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { usermiddleware } from "./middleware";
const JWT_SECRET="kjdsfkjdskjflkdsjfkldsjf";
const app = express();
app.use(express.json());
app.get("/api/v1/", (req, res) => {
  res.json("api is working");
});

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const { name, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({
        message: "user already exist",
      });
    }
    const hasedpassword = await bcrypt.hash(password, 10);
    const newuser = await User.create({
      username: username,
      password: hasedpassword,
      email: email,
      name: name,
    });
    await newuser;
    res.json({
      message: "user registered successfully",
    });
  } catch (e: any) {
    res.json({
      message: e.message,
    });
  }
});
app.post("/api/v1/login",async (req:Request, res:Response): Promise<any> => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
  
      res.json({ message: "Login successful", token });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({
        message: e.message,
      });
    }
  });
  
  app.post("/api/v1/content",usermiddleware,async(req,res) :Promise<any>=>{
    const {link,type}=req.body;
    try {
        await Content.create({
            link:link,
            tag:type,
            //@ts-ignore
            user:req.userId
        })
        return res.status(201).json({
            message:"content added sucessfully"
        })
    } catch (error) {
        
    }
    
  })

  app.get("/api/v1/content",usermiddleware,async(req,res):Promise<any>=>{
    //@ts-ignore
    const userId=req.userId;
    const content=await Content.find({
        user:userId
    }).populate("user")
    return res.json({
        content
    })
  })
  app.delete("/api/v1/content",usermiddleware,async(req,res):Promise<any>=>{
    //@ts-ignore
    try {
        const id=req.body.id;
    await Content.deleteMany({
        _id:id
    })
    return res.json({
        message:"deleted successfully"
    })
        
    } catch (error) {
        console.log(error)
    }
    

  })

async function main() {
  app.listen(3098);
  await mongoose.connect(
    "mongodb+srv://sidharthkshubham:NoNNBtGUEHTp5Lg1@cluster0.thzpp.mongodb.net/secondbraints"
  );
  console.log("hol")
}
main()