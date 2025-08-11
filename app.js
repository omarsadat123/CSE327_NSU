const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const resetRoutes = require('./routes/password-reset-routes');
app.use('/', resetRoutes);

app.listen(3000, () => console.log('Server started at http://localhost:3000'));
