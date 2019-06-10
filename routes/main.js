var express = require('express');
var router = express.Router();

var mainController = require('../controller/mainController');

// Show index page.
router.get('/', mainController.index);

// Show dashboard page
router.get('/dashboard', mainController.dashboard);

// Show municipality page
router.get('/municipality', mainController.municipality);

// Show facility page
router.get('/facility', mainController.facility);

// Show project page
router.get('/project', mainController.project);

module.exports = router;
