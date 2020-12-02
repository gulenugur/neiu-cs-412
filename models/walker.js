const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const WalkerSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },

    availability:{
        type:String,
        trim: true
    },

    location:{
        city:{
            type: String,
            trim:true
        },
        state:{
            type: String,
            trim:true
        },
        zipCode:{
            type: Number,
            required: [true, 'Zip code is required']
        }

    },

    phone:{
        type: String,
        required: [true, 'Phone number is required']
    },

    experience:{
        type: String,
        trim: true
    },

    socialSecurityNumber:{
        type: String,
        required : [true, 'SSN is required'],
        unique: true
    },

})

WalkerSchema.set('toJSON',{getters: true, virtuals: true})
WalkerSchema.set('toObject',{getters: true, virtuals: true})

WalkerSchema.plugin(passportLocalMongoose,{
    usernameField: 'email'
})

WalkerSchema.virtual('fullName').get(function (){
    return `${this.name.first} ${this.name.last}`
})

WalkerSchema.virtual('fullLocation').get(function (){
    return `${this.location.city},${this.location.state}`
})

exports.Walker = mongoose.model('walker', WalkerSchema)