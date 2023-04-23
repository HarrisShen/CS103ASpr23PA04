/*
  transaction.js -- Router for the Transaction
*/
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const TransactionItem = require('../models/Transaction');

const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/transaction',
  isLoggedIn,
  async (req, res, next) => {
    let sortBy = req.query.sortBy;
    let items = [];
    switch (sortBy) {
      case "category":
        items = await TransactionItem.find({userId:req.user._id}).sort({category:1});
        break;
      case "amount":
        items = await TransactionItem.find({userId:req.user._id}).sort({amount:1});
        break;
      case "description":
        items = await TransactionItem.find({userId:req.user._id}).sort({description:1});
        break;
      case "date":
      default:
        items = await TransactionItem.find({userId:req.user._id}).sort({date:-1});
    }
    res.render('transaction', { items });
});

// add the value in the body to the list associated to the key
router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
    const transaction = new TransactionItem(
      {description:req.body.description,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date,
        userId: req.user._id
      });
    await transaction.save();
    res.redirect('/transaction');
});

router.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /transaction/remove/:itemId");
    await TransactionItem.deleteOne({_id:req.params.itemId});
    res.redirect('/transaction');
});

router.get('/transaction/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /tanaction/edit/:itemId");
    const item = await TransactionItem.findOne({_id:req.params.itemId});
    item.type = "transaction";
    res.render('edit', { item });
});

router.post('/transaction/updateTransaction',
  isLoggedIn,
  async (req, res, next) => {
      const {itemId, description, amount, category} = req.body;
      console.log("inside /transaction/updateTransaction");
      await TransactionItem.findOneAndUpdate(
        {_id:itemId},
        {$set: {description, amount, category}});
      res.redirect('/transaction');
});

// group by category
router.get('/transaction/ByCategory',
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /transaction/ByCategory");
    let items = await TransactionItem.aggregate([
      {$match: {userId: new mongoose.Types.ObjectId(req.user._id)}},
      {$group: {_id: "$category", total: {$sum: "$amount"}}},
      {$sort: {total: -1}}
    ]);
    res.render('transactionByCategory', { items });
});

module.exports = router;
