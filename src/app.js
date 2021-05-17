const express = require('express')
const path = require('path')
const app = express()
const hbs = require("hbs");
var exphbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const { check, validationResult } = require('express-validator');//express-validator
require("./db/conn");
const User = require("./models/user")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

const port  = process.env.PORT || 8001;


const static_path = path.join(__dirname,"../public")
const views_path = path.join(__dirname,"../views")
//const partials_path = path.join(__dirname,"../templates/partials")


app.use(express.static(static_path))

app.set("views",views_path)
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set("view engine","handlebars");
//hbs.registerPartials(partials_path);
const index = require('./routers/index')
const users = require('./routers/users')
const details = require('./routers/details')
app.use('/', index);
app.use('/users', users);
app.use('/users/personal',details)



app.listen(port,()=>{
    console.log(`server is running at port no ${port}!!`);
})