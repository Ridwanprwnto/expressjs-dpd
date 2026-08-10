const express = require('express');
const { checkDataSortingPoolController, checkDataByTglAndSPController } = require('../../controllers/sortingPoolController');

const sortingPoolRoute = express.Router();

sortingPoolRoute.post('/packingresult', checkDataSortingPoolController);
sortingPoolRoute.post('/search-by-sp', checkDataByTglAndSPController);

module.exports = sortingPoolRoute;