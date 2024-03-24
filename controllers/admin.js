const Users = require('../models/users');

const sequelize = require('../util/database');

exports.getSignup = (req, res, next) => {
    res.render('admin/signup', {
        pageTitle: 'Signup',
        path: 'admin/signup'
    })
};