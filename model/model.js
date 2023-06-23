const { defaults } = require('joi');
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/bankAccount",{useNewUrlParser:true})


    const balanceSchema = new mongoose.Schema({
        "accountNumber":Number,
        "Fullname": String,
        "Balance": Number,
        "createAt":String
      });
    const Balances = mongoose.model('Balance', balanceSchema);
  
const transactionSchema = new mongoose.Schema({
  senderAccount: Number,
  accountHolder: String,
  receiverAccount: Number,
  amount: Number,
  transferDescription: String
})
const transaction = mongoose.model("Transaction", transactionSchema)


// export default Balances;
module.exports.transaction = transaction;
