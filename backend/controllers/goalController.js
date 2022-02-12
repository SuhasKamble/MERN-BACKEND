const asyncHandler = require('express-async-handler')

const Goal = require('../model/goalModel')
const User = require('../model/userModel')

// @desc     GEt goals
// @eoute    GET /api/goals
// access    Private
const getGoals =asyncHandler(async(req,res)=>{
    const goals = await Goal.find({user:req.user.id})
    res.status(200).json(goals)
})

// @desc     Set goals
// @eoute    GET /api/goals
// access    Private
const setGoals =asyncHandler(async(req,res)=>{
    if(!req.body.text){
        res.status(400)
        throw new Error("Please add a text field")
    }
    
    const goal = await Goal.create({
        text:req.body.text,
        user:req.user.id
    })

    res.status(201).json(goal)
})

// @desc     Update goal
// @eoute    GET /api/goals/:id
// access    Private
const updateGoal =asyncHandler(async(req,res)=>{
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error("Goal not found!")
    }
    const user = await User.findById(req.user.id)
    // check for user
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    
    // make sure the logges in user matches the goal user
    if(goal.user.toString()!==user.id){
        res.status(401)
        throw new Error("User not autorized")
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id,req.body, {new:true})
    res.status(200).json(updatedGoal)
})

// @desc     Delete goal
// @eoute    GET /api/goals/:id
// access    Private
const deleteGoal =asyncHandler(async(req,res)=>{
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Gaol not found!')
    }

    const user = await User.findById(req.user.id)
    // check for user
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    
    // make sure the logges in user matches the goal user
    if(goal.user.toString()!==user.id){
        res.status(401)
        throw new Error("User not autorized")
    }

    const deletedGoal = await Goal.findByIdAndDelete(req.params.id)
    res.status(200).json(deletedGoal)
})

module.exports = {
    getGoals,
    setGoals,
    updateGoal,
    deleteGoal,
}