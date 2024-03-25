const Users = require('../models/users');
const bcrypt = require('bcrypt');

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
        await Users.create({
            name: name,
            email: email,
            password: hashedPassword // Store the hashed password
        });
        res.redirect('/home');
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
            
            if (isPasswordCorrect) {
                res.redirect('/home');
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

exports.getHome = (req, res, next) => {
    res.render('admin/home', {
        pageTitle: 'Home',
        path: 'admin/home'
    });
};