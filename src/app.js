"use strict";
const express = require("express");
const app = express();
const axios = require("axios");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connection } = require("./db/mongoose");

const User = require("./models/user.model");
const Transaction = require("./models/transaction.model")

require("dotenv").config();

// dialog flow 
const {WebhookClient,Card,Suggestion,RichResponse,Payload} = require("dialogflow-fulfillment");

// dialogflow

const PORT = 3000 || process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

const publicDirectoryPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

app.use(express.static(publicDirectoryPath));
app.set("view engine", "hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialsPath);


// dialog flow chatbot


app.get("/chat",(req,res)=>{
// THIS RENDERS THE CHATBOT PAGE (HTML)
    res.render("chat.hbs")
})



app.post("/fulfillment",async(request,response)=>{
    // THIS IS THE CALLBACK URL FOR DIALOG FLOW
    const agent = new WebhookClient({ request, response });
    const userUrl = `${process.env.DOMAIN}/users`
    const transUrl = `${process.env.DOMAIN}/trans`

    const userData = await axios.get(userUrl);

    // const transactionData = await axios.get(transUrl)

    // console.log(userData.data)

    const {name,balance,email}= userData.data[0];

    function welcome(agent) {
      agent.add(`Hello ${name} welcome, how may i help you ?`);

      const payload = {   
        richContent: [
          [
            {
              type: "chips",
              options: [
                {
                  text: "Balance",
                },
                {
                  text: "Bank statement",
                },
                {
                    text: "Inquiry",
                  },
              ],
            },
          ],
        ],
      };
      agent.add(
        new Payload(agent.UNSPECIFIED, payload, {
          rawPayload: true,
          sendAsMessage: true,
        })
      );
    }

    // follow up intent 

    function balanceFollowup(agent){
        agent.add(`Hello ${name} your balance is Ksh.${balance}`);

      }
  
    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }


  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);


//   intentMap.set("userBalance" ,balanceFollowup);
intentMap.set("Default Welcome Intent - yes",balanceFollowup)




  agent.handleRequest(intentMap);

})

// -----------  dialog flow chatbot End

// creating user
app.post("/users",async(req,res)=>{
// THIS ADDS USER  
    // console.log(req.body);
   
    const { name,nationalId,accountNumber,email} = req.body;

    
    const newUser= new User({
        name,
        nationalId,
        accountNumber,
        email
     
    });

    // console.log(newUser);

    await newUser.save();

    res.status(201).send(newUser);


})

// get user data

app.get("/users",async(req,res)=>{
//    FETCHES  USER DATA FROM SPECIFIC ID

    // TODO: get id from user loggedin

    const user = "6419873635b43de64815c0a8"

    const userData = await User.find({_id:user})
    
    res.send(userData);
})
// creating 


// transactions
 app.get("/trans",async(req,res)=>{
    //  this FETCHES the specific user transactions
    const user = "6419873635b43de64815c0a8" // TODO: FROM LOGIN

    const userData = await Transaction.find({user})
    
    res.send(userData);

 })


 app.post("/trans",async(req,res)=>{
    // this route adds a transaction (ATM) 
    console.log(req.body)
    const {transType,transAmount} =  req.body;


    // generate tranaction id 

        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let transId = '';
        for (var i = 0; i < 9; i++) {
          transId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
    // -------  generate trans id end

    // populate user
    // const user = "6419873635b43de64815c0a8"; //TODO: USER FROM LOGIN

    const userUrl = `${process.env.DOMAIN}/users`

    const userData = await axios.get(userUrl);

    console.log(userData.data)

    const {balance,_id}= userData.data[0];

    
    // withdraw and deposit
    let newAmount;
    if(transType === "DEPOSIT"){

     newAmount = transAmount + balance
        console.log(newAmount)
        


    }else if(transType === "WITHDRAW"){

        if(transAmount > balance){
            console.log("insufficient balance")

        }else{
        newAmount =balance- transAmount
             console.log(newAmount)

           
 
        }
        

    }


    const filter = { _id: _id };
  const update = { balance: newAmount };
  const options = { new: true };
  const updatedUser = await User.findOneAndUpdate(filter, update, options);
  console.log(updatedUser.balance);
    


    // -----withdraw and deposit

    const newTransaction = new Transaction({
      transId,
      transType,
      transAmount,
      user:_id

    });

    console.log(newTransaction);

    await newTransaction.save();

    res.status(201).send(newTransaction);
      


 })






 
  

// transactions

app.listen(PORT,async()=>{
    await connection();
    console.log("app running on 3000")
}) 