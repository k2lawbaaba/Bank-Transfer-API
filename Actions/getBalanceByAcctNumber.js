const Balances= require("../model/model");
const bodyParser = require('body-parser');
const express= require('express');


// const app= express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

const getBalanceByAcctNumber= async (req, res)=>{
    try {
        const account= await Balances.findOne({accountNumber:req.body.account}, ('accountNumber Fullname Balance -_id')).exec();
        res.status(200).send(account);
    } catch (error) {
        console.error(error);
    }
}
module.exports=getBalanceByAcctNumber;