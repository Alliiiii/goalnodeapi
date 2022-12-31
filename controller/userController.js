const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const asyncHandler=require('express-async-handler')
const User=require('../model/userModel')
const registerUser=asyncHandler(async (req,res)=>{
    const {name,email,password}=req.body
    if(!name){
        res.status(400).json({message:"Please add name"})
        throw new Error("Please add name")
    }
    if(!email){
        res.status(400).json({message:"Please add email"})
        throw new Error("Please add email")
    }
    if(!password){
        res.status(400).json({message:"Please add password"})
        throw new Error("Please add password")
    }

    //check if user exits
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400).json({message:"User already exists"})
        throw new Error("User already exists")
    }

    //Hash password
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)

    //create user
    const user=await User.create({name,email,password:hashedPassword})
    if(user){
        res.status(201).json({message:"user created scussfully",
        token:generateToken(user._id),
    data:user})
    }
    else{
        res.status(400).json({message:"invalid user data"})
        throw new Error("invalid user data")
    }

    res.json({
        meessage:"register user"
    })
})


const loginUser=asyncHandler(async (req,res)=>{
    const{email,password}=req.body

    //check for user email
    const user=await User.findOne({email})

    if(user&& (await bcrypt.compare(password,user.password)))
    {
        res.status(200).json({message:"user login scussfully",   data:user,  token:generateToken(user._id),})
    }
    else{
        res.status(400).json({message:"invalid user credential"})
        throw new Error("invalid user credential")
    }
    res.json({
        meessage:"login user"
    })
})

const getMe=asyncHandler(async (req,res)=>{
    const {_id,name,email}=await User.findById(req.user.id)
    res.status(200).json({
        id:_id,
        email,name,
       // data:req.user
    })
   
})


//Generate JWT
const generateToken=(id)=>{
    return jwt.sign({id},
        process.env.JWT_SECRET,
        {expiresIn:'30d'},)
}



module.exports={
    registerUser,
    loginUser,
    getMe
}