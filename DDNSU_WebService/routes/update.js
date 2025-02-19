'use strict';
const express = require('express');
const fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;

    // Send the response
    res.send(`First DDNS Name: ${data.ddnss[0].name}`);
});

module.exports = router;
