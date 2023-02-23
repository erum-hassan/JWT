const mongoose = require('mongoose')
const {schema} = mongoose

const User = new mongoose.Schema({

     Email:{
        type:String,
        require:true,
        unique:true
     },
     Password:{
        type:String,
        require:true,
        minLength:[8,'minimum password should be 8']
     },
     Role:{
        type:String,
        require:true,
        enum:['Student','Teacher','Admin'],
        default:'Teacher'
     }
     
})

module.exports = mongoose.model('User', User)