const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    nationalId:{
        type:Number,
        required:true,
        unique:true,
    },
    accountNumber:{
        type:String,
        required:true,
        unique:true,
    }, 
    balance:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        default:Date.now
    },
    email:{
        type:String,
        required:true,
        unique:true,
    }
})


const User = mongoose.model("User", userSchema);

module.exports = User;
