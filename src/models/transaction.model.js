const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    transId:{
        type:String,
        required:true,
        unique:true,
    },
    transType: {
        type: String,
        enum: ['DEPOSIT', 'WITHDRAW'],
        required: true
      },
     transAmount:{
        type:Number,
        default:0
    },
    transDate:{
        type:Date,
        default:Date.now
    },
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
})


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
