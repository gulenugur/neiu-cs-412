const express = require('express')
const router = express.Router()
const { registerValidations, walkerController} = require('../controllers/walker-controller')

router.get('/walker-register', async (req,res,next)=>{
    res.render('walkers/walker-register',{
        title: 'Walker Register'
    })
})
router.post('/save', async (req,res,next)=> {
    await walkerController.save(req, res, next)
})

router.get('/view_walkers',async(req,res,next)=> {
    await walkerController.viewAll(req,res,next)
})
router.post('/walker-register',registerValidations,async (req,res,next) =>{
    await walkerController.create(req,res,next)
})

router.get('/view_one',async (req,res,next)=> {
    await walkerController.view(req, res, next)
})

module.exports = router