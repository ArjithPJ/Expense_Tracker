const express = require("express");
const bodyParser = require('body-parser');

//const errorController =require('./controllers/error');
const sequelize = require('./util/database');
//const Tables = require('./models/tables');
const Users = require('./models/users');
const Expenses = require('./models/expenses');
const Orders = require('./models/purchases');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.use(adminRoutes);
//app.use(errorController.get404);

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(Orders);
Orders.belongsTo(Users);

sequelize
    .sync()
    .then(result => {
        console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
