const express = require('express')
const router = express.Router()
const {parkController} = require('../controllers/park-controller')


router.get('/add',async (req,res,next)=> {
    await parkController.add(req,res,next)
})

router.post('/save', async (req,res,next)=>{
    await parkController.save(req,res,next)
})

router.get('/viewall',async(req,res,next)=> {
    await parkController.viewAll(req,res,next)
})

router.get('/view',async (req,res,next)=>{
    await parkController.view(req,res,next)
})

router.get('/edit',async (req,res,next)=>{
    await parkController.edit(req,res,next)
})

router.get('/delete', async(req,res,next)=>{
    await parkController.delete(req,res,next)

})

module.exports = router

