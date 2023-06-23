const express = require('express');
const router= express.Router();
const accountCreation = require("../Actions/accountCreation");
const getBalance = require("../Actions/getBalance");
const getBalanceByAcctNumber = require("../Actions/getBalanceByAcctNumber");
const Transfer = require('../Actions/Transfer')



router.post('/create_account', ((req, res)=>{
   accountCreation(req.body, res); 
}))

router.get('/balance',  getBalance);

router.get('/balance/:accountNumber', getBalanceByAcctNumber);

// router.post('/transfer', Transfer);

module.exports= router;