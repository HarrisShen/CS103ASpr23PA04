/*
  transaction.js -- Router for the Transaction
*/
const express = require('express');
const router = express.Router();
const TransactionItem = require('../models/Transaction');
const User = require('../models/User');


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

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
    let items = await TransactionItem.find({userId:req.user._id})
      .sort({date:-1, createdAt:-1});
    res.render('transaction', {items});
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
    //res.render('edit', { item });
    res.locals.item = item;
    res.render('edit');
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

module.exports = router;
