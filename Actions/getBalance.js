const Balances= require("../model/model");

const getBalance= async (req, res)=>{
    try {
        const account= await Balances.find({}, ('accountNumber Fullname Balance -_id')).exec();
        res.status(200).send(account);
    } catch (error) {
        console.error(error);
    }
}
module.exports=getBalance;