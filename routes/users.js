const express = require('express')
const router = express.Router()
const { registerValidations, userController} = require('../controllers/user-controller')

router.get('/register', async (req,res,next)=>{
    res.render('users/register',{
        title: 'Register'
    })
})

router.post('/register',registerValidations,async (req,res,next) =>{
    await userController.create(req,res,next)
})

router.get('/login', async (req,res,next)=>{
    res.render('users/login',{
        title: 'Login'
    })
})

router.post('/login',async (req,res) =>{
    await userController.authenticate(req,res)
})

router.get('/logout',async (req,res,next) =>{
    await userController.logOut(req,res,next)
})
router.get('/profile',async (req,res,next) =>{
    await userController.userProfile(req,res,next)
})
router.get('/changepassword', async (req,res,next)=>{
    res.render('users/changepassword',{
        title: 'Change Password'
    })
})
router.post('/changepassword',async (req,res) =>{
    await userController.updateUser(req,res)
})

module.exports = router