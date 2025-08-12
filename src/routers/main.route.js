const express = require('express');
const modulePlano = require('./modules/planopick.route');

const mainRouter  = express.Router();

mainRouter.use('/planopick', modulePlano);

module.exports = mainRouter ;