const asyncHandler=require('express-async-handler')

const Goal=require('../model/goalModel')
const User=require('../model/userModel')
const getGoals=asyncHandler(async (req,res) =>{
    const goals=await Goal.find({user:req.user.id})
    res.json({message:"get goals",data:goals});
})
const sampledata=asyncHandler(async(req,res)=>{
    res.json({message:"sample dara api call"})
})

const setGoal=asyncHandler(async(req,res) =>{
    if(!req.body.text){
        //res.status(400).json({message:"Please add a text field"})
        res.status(400)
        throw new Error('Please add a text field')

    }
    const goal=await Goal.create(
       { text:req.body.text,
    user:req.user.id}
    )
    console.log("data is "+{ text:req.body.text,
        user:req.user.id}.toString())
    res.json({message:"set goal",data:goal});
})


const updateGoal=asyncHandler(async(req,res) =>{
  
     const goal=await Goal.findById(req.params.id)
        if(!goal){
          res.status(400)
          throw new Error("goal not found")
     }

     const user=await User.findById(req.user.id)
     //check user
     if(!user){
        res.status(401).json({message:"user not found"})
        throw new Error("user not found")
        
     }
     //make sure the login in user matches the goal user
     if(goal.user.toString() !== user.id){
        res.status(401).json({message:"user not authorize"})
        throw new Error("user not authorize")
        
     }
     const updatedGoal=await Goal.findByIdAndUpdate(req.params.id,
         req.body,{new:true}
        )
     res.json({message:`update  goal `,data:updatedGoal});
})

const deleteGoal=asyncHandler(async(req,res) =>{
    const goal=await Goal.findById(req.params.id)
    if(!goal){
      res.status(400)
      throw new Error("goal not found")
 }
 
 const user=await User.findById(req.user.id)
 //check user
 if(!user){
    res.status(401).json({message:"user not found"})
    throw new Error("user not found")
    
 }
 //make sure the login in user matches the goal user
 if(goal.user.toString()!==user.id){
    res.status(401).json({message:"user not authorize"})
    throw new Error("user not authorize")
    
 }
    await goal.remove()
    res.json({message:`delete  goal ${req.params.id}`});
})



module.exports={
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
    sampledata
}