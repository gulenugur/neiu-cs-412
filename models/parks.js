const mongoose = require('mongoose')

const ParkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Minimum title length is 3 characters']
    },
    address:{
        type: String,
        required: [true, 'Address is required'],
        minlength: [5, 'Minimum address length is 5 characters']
    },
    phone: {
        type: String,
        length: [12, 'Phone number must be twelve digits(with hyphen)']
    },
    hours:{
        type: String,
        required: [true, 'Hour is required']
    }
})

ParkSchema.set('toObject',{getters: true, virtuals: true})

exports.Park = mongoose.model('parks', ParkSchema)