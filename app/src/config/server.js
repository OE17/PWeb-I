require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('../routes/usuario.route');
const handle404Error = require('../middlewares/handle404Error');
const handleError = require('../middlewares/handleError');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/usuarios', routes);

app.use(handle404Error);
app.use(handleError);

module.exports = app;
