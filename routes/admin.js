const express =require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/signup', adminController.getSignup);

module.exports = router;