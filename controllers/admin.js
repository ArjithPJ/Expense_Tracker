const Users = require('../models/users');
const bcrypt = require('bcrypt');

const sequelize = require('../util/database');

exports.getSignup = (req, res, next) => {
    res.render('admin/signup', {
        pageTitle: 'Signup',
        path: 'admin/signup'
    })
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // const [account, metadata] = sequelize.query(`SELECT * from Users WHERE email='${req.body.email}'`);
    // sequelize.query(`SELECT * from Users WHERE email='${req.body.email}'`)
    Users.findByPk(email)
    .then(result =>{
        console.log(result);
        if(result){
            console.log("Account already exists");
            res.redirect('/signup');
        }
        else{
            Users.create({
                name: name,
                email: email,
                password: password
            });
            res.redirect('/home');
        }
    })
    .catch(err => {
        console.log(err);
        
    });
};

exports.getLogin = (req, res, next) => {
    res.render('admin/login', {
        pageTitle: 'Login',
        path: 'admin/login'
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
    console.log(req.body.password);
    Users.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                res.status(401).json({ message: "User not found" });
            } 
            else if (user.password !== password) {
                res.status(401).json({ message: "Incorrect password" });
            } 
            else {
                res.render('admin/home', {
                    pageTitle: 'Home',
                    path: 'admin/home'
                })
            }
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).json({ message: "Internal server error" });
        });
}
exports.getHome = (req, res, next) => {
    res.render('admin/home', {
        pageTitle: 'Home',
        path: 'admin/home'
    });
};