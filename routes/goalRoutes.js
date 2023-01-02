const express=require('express')
const router=express.Router()
const {getGoals,setGoal,updateGoal,deleteGoal,sampledata}=require('../controller/goalController')
const {protect}=require('../middleware/authMiddleware')

router.route('/').get(protect,getGoals).post(protect,setGoal)
router.route('/:id').put(protect,updateGoal).delete(protect,deleteGoal)
router.route('/hello').get(sampledata)

module.exports=router