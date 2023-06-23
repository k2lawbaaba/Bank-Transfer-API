const express= require('express');
const dotenv =require('dotenv');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const {Transaction, createAccount} = require('./Validation/Validate');

const app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

var accountNo = Math.floor(1000000000 + Math.random() * 9000000000)
 var referenceNo = Math.floor(1000000000000 + Math.random() * 9000000000000)

dotenv.config({path:"./config.env"})

mongoose.connect("mongodb://127.0.0.1:27017/bankAccount",{useNewUrlParser:true})

const balanceSchema = new mongoose.Schema({
    "accountNumber":Number,
    "Fullname": String,
    "Balance": Number,
    "createAt":String
  });
const Balances = mongoose.model('Balance', balanceSchema);

const transactionSchema = new mongoose.Schema({
    referenceNo:Number,
    senderName: String,
    senderAccount: Number,
    amount: Number,
    receiverName:String,
    receiverAccount: Number,
    Narration: String,
    createAt: String
  })
  const transaction = mongoose.model("Transaction", transactionSchema)

const Port= process.env.PORT || 5000;


app.post('/create_account', (req, res)=>{
    const {error, value} = createAccount(req.body);
    if(error){
        res.status(400).json(error)
    }
    else{        
        try {              
               const balance= new Balances({
                   "accountNumber":accountNo,
                    "Fullname": value.fullName,
                    "Balance": value.Balance,
                    "createAt": Date()                
                });
           balance.save().then(()=>{
                    console.log("Account created succesfully")
                })
                res.status(200).send(`Account created succesfully. Your Account is ${accountNo}`)
        } catch (error) {
         res.status(400).json(error);  
        }
    }           
})

// getting the balance from the database
app.get("/balance", async (req, res)=>{
     try {
       const result= await Balances.find({}, 'accountNumber Fullname Balance -_id').exec();
                res.status(200).json(result)
    } catch (error) {
        console.error(error);
    }
    
})

app.get("/balance/:accountNumber", async (req,res)=>{
    try {
        const account= await Balances.findOne({accountNumber:req.body.account}, ('accountNumber Fullname Balance -_id')).exec();
        res.status(200).send(account);
    } catch (error) {
        console.error(error);
    }
} )
app.post("/transfer", async (req,res)=>{
    const {error, value}=Transaction(req.body);
    if(error){
        return res.status(400).send(error)}

        var deposit= value.amount;
        var senderAcctNo= value.senderAccount;
        var Narration= value.Narration;
        var receiverAccount= value.receiverAccount;
        var senderBalance, receiverBalance=0;
        let SenderName, ReceiverName ;

try {
    const senderAccnt= await Balances.find({accountNumber:senderAcctNo}, ('Fullname Balance -_id')).exec();
    const recieverAcct= await Balances.find({accountNumber:receiverAccount}, ('Fullname Balance -_id')).exec();
    
    // fetching the balance
    senderAccnt.forEach(item=>{
         senderBalance=(item.Balance);
         SenderName= item.Fullname;
        })
     recieverAcct.forEach(item=>{
        ReceiverName = item.Fullname;
        receiverBalance = item.Balance;
    })
     
    // deducting amount in account holder's bank 
    if(senderBalance >= deposit){
        senderBalance -=deposit;
        receiverBalance +=deposit;

        // updating the sender and receiver balances
        await Balances.updateOne({accountNumber:senderAcctNo},{$set: {Balance: senderBalance}})
        await Balances.updateOne({accountNumber:receiverAccount},{$set:{Balance: receiverBalance}})

        //creating transaction collection
        const trans= new transaction({
            reference: referenceNo,
            senderName:SenderName,
            senderAccount: senderAcctNo,
            amount: deposit,
            receiverName:ReceiverName,
            receiverAccount: receiverAccount,
            narration: Narration,
            createAt:Date()
        })
        trans.save().then(()=>{
            console.log("Transfer done");
        })
        res.status(200).send(`Transfer done succesfully.`)
    }
    else{
        res.send('Insufficient Balance')
        }
    
        } 
        catch (error) {
            console.error(error);
        }
})

app.listen(Port, console.log("Server is running "))