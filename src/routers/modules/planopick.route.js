const express = require('express');
const { 
    checkDataPickingController, 
    updateDataPickingController
} = require('../../controllers/planoPickController');

const planoPickRoute = express.Router();

planoPickRoute.post('/datapick', checkDataPickingController);
planoPickRoute.put('/datapick/:seqNO', updateDataPickingController);

module.exports = planoPickRoute;