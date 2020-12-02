let Park = require('../models/parks').Park
let {User} = require('../models/user')
const mongoose =require('mongoose')
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

exports.parkController = {
    save: async (req,res,next) => {
        try {
            let park
            if (req.body.saveMethod === 'create') {
                park = await create(req.body.title, req.body.address, req.body.phone, req.body.hours)
                req.user.parks.push(park.id.trim())
                req.user = await User.findByIdAndUpdate({_id: req.user.id.trim()},{parks: req.user.parks},{new: true})
            }else
                park = await update(req.body.parkId, req.body.title, req.body.address, req.body.phone, req.body.hours)
            res.redirect(`/parks/view?id=${park._id}`)
        } catch (err) {
            next(err)
        }
    },

    add: async (req,res,next) =>{
        if(req.isAuthenticated()) {
            try {
                res.render('parks/add_park', {
                    isCreate: true,
                    title: 'Add Park',
                    isAddActive: 'active',
                    styles: ['/stylesheets/style.css']
                })
            } catch (err) {
                next(err)
            }
        }else {
            req.flash('error', 'Please log in to add park.')
            res.redirect('/users/login')
        }

    },

    edit: async (req,res,next) =>{
        if(req.isAuthenticated()) {
            try {
                let park = await Park.findOne({_id: req.query.id.trim()})
                res.render('parks/edit_park', {
                    isCreate: false,
                    title: 'Edit Park',
                    parkTitle: park.title,
                    parkId: req.query.id,
                    parkAddress: park.address,
                    parkPhone: park.phone,
                    parkHours: park.hours,
                    styles: ['/stylesheets/style.css']
                })
            } catch (err) {
                next(err)
            }
        }else{
            req.flash('error', 'Please log in to edit park.')
            res.redirect('/users/login')
        }
    },

    view: async (req,res,next) => {
        if(req.isAuthenticated()) {
            try {
                let park = await Park.findOne({_id: req.query.id.trim()})
                res.render('parks/view_park', {
                    title: 'View Park',
                    parkTitle: park.title,
                    parkId: req.query.id,
                    parkAddress: park.address,
                    parkPhone: park.phone,
                    parkHours: park.hours,
                })
            } catch (err) {
                next(err)
            }
        }else{
            req.flash('error', 'Please log in to view park.')
            res.redirect('/users/login')
        }
    },

    viewAll: async (req,res,next) =>{
        if(req.isAuthenticated()) {
            try {
                let parkIds = req.user.parks
                let parkPromises = parkIds.map(id => Park.findOne({_id: id}))
                let parks = await Promise.all(parkPromises)
                let allParks = parks.map(park => {
                    return {
                        id: park._id,
                        title: park.title,
                    }
                })
                res.render('parks/view_all', {
                    parkList: allParks,
                    title: 'View All'
                })
            } catch (err) {
                next(err)
            }
        }else{
            req.flash('error', 'Please log in to view parks.')
            res.redirect('/users/login')
        }

    },

    delete: async (req,res,next) => {
        try {
            const parkIndex = req.user.parks.indexOf(req.body.parkId)
            req.user.parks.splice(parkIndex,1)
            req.user = await User.findByIdAndUpdate({_id: req.user.id},{parks: req.user.parks}, {new: true})
            await User.findByIdAndDelete(req.body.parkId)
            req.flash('success', 'Park deleted successfully')
            res.redirect('/parks/viewall')

        } catch (err) {
            next(err)
        }
    },

}

create = async (title, address,phone, hours) =>{

    let park = new Park({
        title: title,
        address: address,
        phone: phone,
        hours: hours,
    })
    park = await park.save()
    return park
}

update = async (id, title, address, phone, hours) =>{
    let park = await Park.findByIdAndUpdate({_id: id}, {
        title: title,
        address: address,
        phone: phone,
        hours: hours,
    },{new: true})
    return park
}