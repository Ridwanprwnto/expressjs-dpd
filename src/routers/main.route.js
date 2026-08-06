const express = require('express');
const modulePlano = require('./modules/planopick.route');
const moduleSortingPool = require('./modules/sortingpool.route');

const mainRouter = express.Router();

mainRouter.use('/planopick', modulePlano);

mainRouter.use('/sortingpool', moduleSortingPool);

module.exports = mainRouter;