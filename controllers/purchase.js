const Users = require('../models/users');
const Expenses = require('../models/expenses');
const Orders = require('../models/purchases');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sequelize = require('../util/database');
const Razorpay = require('razorpay');
require('dotenv').config();


exports.postbuyPremium = (req, res, next) => {
    console.log("Req.body: ", req.body);
    const { paymentId } = req.body;
    
    // Here, you would typically store the payment ID in your database
    // This is just a placeholder response
    console.log('Storing payment ID:', paymentId);
    res.status(200).json({ message: 'Payment ID stored successfully' });
};