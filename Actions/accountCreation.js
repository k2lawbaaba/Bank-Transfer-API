const Balances= require("../model/model");
const {createAccount} = require('../Validation/Validate');



        var accountNo = Math.floor(1000000000 + Math.random() * 9000000000)

const accountCreation= async (req, res)=>{
    console.log(req);
    const {error, value} =await createAccount(req);
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
}

module.exports=accountCreation;