
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var TransactionSchema = Schema( {
  description: String,
  amount: Number,
  category: String,
  date: Date,
  createdAt: {type:Date, default:Date.now},
  userId: {type:ObjectId, ref:'user' }
} );

module.exports = mongoose.model( 'TransactionItem', TransactionSchema );
