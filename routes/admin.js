const express =require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/signup', adminController.getSignup);
router.post('/signup', adminController.postSignup);
router.get('/home', adminController.getHome);


module.exports = router;