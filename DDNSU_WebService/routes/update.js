'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    const data = req.app.locals.data;
    res.send(`Config Value: ${data.configValue}`);
});

module.exports = router;
