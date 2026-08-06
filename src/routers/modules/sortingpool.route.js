const express = require('express');
const { checkDataSortingPoolController } = require('../../controllers/sortingPoolController');

const sortingPoolRoute = express.Router();

sortingPoolRoute.post('/packingresult', checkDataSortingPoolController);

module.exports = sortingPoolRoute;