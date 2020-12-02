let Walker = require('../models/walker').Walker
let mongoose = require('mongoose')
const {body, validationResult} = require('express-validator')

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (err){
        console.log(err)
    }
}
exports.walkerController = {
    create: async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/walkers/walker-register')
        } else {
            try {
                let walkerParams = getWalkerParams(req.body)
                let newWalker = new Walker(walkerParams)
                let walker = await Walker.register(newWalker,req.body.password)
                req.flash('success', `${walker.fullName}'s account created successfully`)
                res.redirect('/')
            } catch (error) {
                console.log(`Error saving user: ${error.message}`)
                req.flash('error', `Failed to create walker account. Invalid email.`)
                res.redirect('back')
            }
        }
    },

    viewAll: async (req,res,next) =>{
        if(req.isAuthenticated()) {
            try {
                let walkers = await Walker.find({})
                let allWalkers = walkers.map(walker => {
                    return {
                        id: walker._id,
                        walkerName: walker.fullName,
                        walkerLocation: walker.fullLocation,
                        walkerAvailability: walker.availability,
                        walkerPhone: walker.phone,
                        walkerExperience: walker.experience
                    }
                })
                res.render('walkers/view_walkers', {
                    walkerList: allWalkers,
                    title: 'Walkers'

                })
            } catch (err) {
                next(err)
            }
        }else{
            req.flash('error', 'Please log in to view walkers.')
            res.redirect('/users/login')
        }

    },

    view: async (req,res,next) => {
        if(req.isAuthenticated()) {
            try {
                let walker = await Walker.findOne({_id: req.query.id.trim()})
                res.render('walkers/view_one', {
                    title: 'View Walker',
                    walkerName: walker.fullName,
                    walkerId: req.query.id,
                    walkerLocation: walker.fullLocation,
                    walkerZip: walker.location.zipCode,
                    walkerAvailability: walker.availability,
                    walkerExperience: walker.experience,
                    walkerPhone: walker.phone,
                    walkerEmail: walker.email
                })
            } catch (err) {
                next(err)
            }
        }else{
            req.flash('error', 'Please log in to view walkers.')
            res.redirect('/users/login')
        }
    },
}

const getWalkerParams = body =>{
    return{
        name: {
            first: body.first,
            last: body.last
        },
        availability: body.availability,
        location:{
            city: body.city,
            state: body.state,
            zipCode: body.zipCode
        },
        phone: body.phone,
        experience: body.experience,
        socialSecurityNumber: body.socialSecurityNumber,
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
    body('availability')
        .notEmpty().withMessage('Availability cannot be empty'),
    body('city')
        .notEmpty().withMessage('City is required'),
    body('state')
        .notEmpty().withMessage('State is required'),
    body('zipCode')
        .notEmpty().withMessage('Zipcode is required')
        .isLength({min:5,max:5}).withMessage('Zip Code must be 5 digits'),
    body('phone')
        .notEmpty().withMessage('Phone is required')
        .isLength({min:12,max:12}).withMessage('Phone number must be 12 digits(with hyphens)'),
    body('experience')
        .notEmpty().withMessage('Experience is required'),
    body('socialSecurityNumber')
        .notEmpty().withMessage('SSN is required')
        .isLength({min:11,max:11}).withMessage('SSN must be 11 digits(with hyphens)'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    body('email').isEmail().normalizeEmail().withMessage('Email is invalid')
]