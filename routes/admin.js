const express =require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/signup', adminController.getSignup);
router.post('/signup', adminController.postSignup);
router.get('/home', adminController.getHome);

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);

module.exports = router;