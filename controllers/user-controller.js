let User = require('../models/user').User
const {body, validationResult} = require('express-validator')
const passport = require('passport')

exports.userController = {
     create: async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/users/register')
        } else {
            try {
                let userParams = getUserParams(req.body)
                let newUser = new User(userParams)
                let user = await User.register(newUser,req.body.password)
                req.flash('success', `${user.fullName}'s account created successfully`)
                res.redirect('/users/login')
            } catch (error) {
                console.log(`Error saving user: ${error.message}`)
                req.flash('error', `Failed to create user account. Invalid email.`)
                res.redirect('back')
            }
        }
    },

    updateUser: async (req,res,next) =>{
        try{
            let user = await User.findOne({ _id: req.user.id.trim() })
            User.findOne({ _id: req.user.id.trim() },(err, user) => {
                if (err)
                    return next(err)
                if (!user) {
                    req.flash('error',`Failed to login`)
                    return res.redirect('back')
                } else {
                    user.changePassword(req.body.password, req.body.newPassword, function(err) {
                        if(err)
                            return next(err)
                        else
                            req.flash('success',`Your password has been changed successfully`)
                        return res.redirect('/users/profile');
                    })
                }
            })

            await user.updateOne({name:{first: req.body.first, last:req.body.last}})
            await user.updateOne({dog:{breed: req.body.breed, age: req.body.age}})

        }catch (err){
            req.flash('error', 'Failed to update account. Invalid password')
            res.redirect('back')
        }
    },

    logOut: async (req,res,next)=>{
        try{
            req.logout()
            req.flash('success','Logged Out')
            res.redirect('/')
        }
        catch(err){
            next(err)
        }
    },

    userProfile: async (req,res,next) => {
        if (req.isAuthenticated()) {
            try {
                let user = await User.findOne({_id: req.user.id.trim()})
                res.render('users/profile', {
                    title: 'Profile',
                    userName: user.fullName,
                    breed: user.dog.breed,
                    age: user.dog.age
                })
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access profile')
            res.redirect('/users/login')
        }
    },

    authenticate: async (req,res,next) =>{

         await passport.authenticate('local',function (err, user,info) {
             if(err)
                 return next(err)
             if (!user) {
                 req.flash('error',`Failed to log in!`)
                 return res.redirect('back')
             }
             req.logIn(user, function(err){
                 if(err)
                     return next(err)
                 req.flash('success', `${user.fullName} logged in!`)
                 return res.redirect('/')
             })
         })(req,res,next);
    }
}

const getUserParams = body =>{
    return{
        name: {
            first: body.first,
            last: body.last
        },
        dog: {
            breed: body.breed,
            age: body.age
        },
        password: body.password,
        email: body.email
    }
}

exports.registerValidations = [
    body('first')
        .notEmpty().withMessage('First name is required')
        .isLength({min: 2}).withMessage('First name must be at least 2 characters'),
    body('last')
        .notEmpty().withMessage('Last name is required')
        .isLength({min: 2}).withMessage('Last name must be at least 2 characters'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    body('breed')
        .notEmpty().withMessage('Breed is required')
        .isLength({min: 2}).withMessage('Breed must be at least 2 characters'),
    body('age')
        .notEmpty().withMessage('Age is required')
        .isNumeric().withMessage('Age must be number'),
    body('email').isEmail().normalizeEmail().withMessage('Email is invalid')
]