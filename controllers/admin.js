const Users = require('../models/users');
const Expenses = require('../models/expenses');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sequelize = require('../util/database');

exports.getSignup = (req, res, next) => {
    res.render('admin/signup', {
        pageTitle: 'Signup',
        path: 'admin/signup'
    })
};

exports.postSignup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Check if user already exists
        const existingUser = await Users.findOne({where:{ email: email}});
        if (existingUser) {
            console.log("Account already exists");
            return res.redirect('/signup');
        }

        // Encrypt the password
        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);

        // Create user with encrypted password
        const newUser = await Users.create({
            name: name,
            email: email,
            password: hashedPassword // Store the hashed password
        });
        console.log(newUser);
        const token = jwt.sign({id: newUser.id},'cenf93rh23rhqiuuhqw');
        return res.redirect('/home/'+ token);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getLogin = (req, res, next) => {
    res.render('admin/login', {
        pageTitle: 'Login',
        path: 'admin/login',
        errorMessage: null
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await Users.findOne({ where: { email: email } });

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            console.log(user);
            const userId = user.id;
            const token = jwt.sign({id: userId},'cenf93rh23rhqiuuhqw');
            
            if (isPasswordCorrect) {
                res.redirect('/home/'+token);
            } else {
                res.render('admin/login', {
                    pageTitle: 'Login',
                    path: 'admin/login',
                    errorMessage: "Incorrect password"
                });
            }
        } else {
            res.render('admin/login', {
                pageTitle: 'Login',
                path: 'admin/login',
                errorMessage: "User not found"
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.postAddExpense = (req, res, next) => {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    console.log(req.params);
    const token =req.params.id;
    jwt.verify(token, 'cenf93rh23rhqiuuhqw', (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
        } else {
            console.log('Decoded token:', decoded);

            Expenses.create({
                amount: amount,
                description: description,
                category: category,
                id:  decoded.id
            })
            .then(()=>{
                return res.redirect('/home/'+token);
            })
            .catch(error => {
                console.error('Error creating expense:', error);
                return res.status(500).json({ message: 'Internal server error' });
            });
        }
    });
    
};

exports.getHome = (req, res, next) => {
    const token = req.params.id;
    jwt.verify(token,'cenf93rh23rhqiuuhqw', (err,decoded) => {
        if(err){
            console.error('Token Verification failed:', err);
        } 
        else{
            console.log('Decoded token:', decoded);
            sequelize.query(`SELECT * from expenses WHERE id='${decoded.id}'`)
            .then(([expenses, metadata])=>{
                console.log(expenses);
                res.render('admin/home', {
                    pageTitle: 'Home',
                    path: 'admin/home',
                    expenses: expenses,
                    id: token
                });
            })
            .catch(err => {
                console.log(err);
            });
        }
    });
};

exports.postDeleteExpense =(req, res, next) => {
    const expenseId = req.body.expenseId;
    const token = req.params.id;
    jwt.verify(token, 'cenf93rh23rhqiuuhqw', (err, decoded) => {
        if(err){
            console.log('Token Verification failed:', err);
        }
        else{
            console.log('Decoded token:', decoded);
            Expenses.findByPk(expenseId)
            .then(expense => {
                return expense.destroy();
            })
            .then(() => {
                res.redirect('/home/'+token);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Internal server error" });
            });
        }
    })
};