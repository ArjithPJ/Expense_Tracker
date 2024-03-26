const express =require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/signup', adminController.getSignup);
router.post('/signup', adminController.postSignup);
router.get('/home/:id', adminController.getHome);

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);

router.post('/add-expense/:id', adminController.postAddExpense);
router.post('/delete-expense/:id', adminController.postDeleteExpense);

module.exports = router;