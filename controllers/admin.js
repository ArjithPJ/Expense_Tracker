const Users = require('../models/users');

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

exports.getHome = (req, res, next) => {
    res.render('admin/home', {
        pageTitle: 'Home',
        path: 'admin/home'
    });
};