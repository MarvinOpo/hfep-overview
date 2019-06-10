var express = require('express');
var router = express.Router();

var muncityController = require('../controller/muncityController');
var facilityController = require('../controller/facilityController');
var projectController = require('../controller/projectController');

//------------------------MUNICIPAL-------------------------------//

// Insert municipal
router.post('/muncity/insert', muncityController.insert);

// Update municipal
router.post('/muncity/update', muncityController.update);

// Delete municipal
router.get('/muncity/delete', muncityController.delete);

// Get municipalities
router.get('/muncity/get_municipalities', muncityController.get_municipalities);

// Get districts
router.get('/muncity/get_districts', muncityController.get_districts);

// Count municipalities
router.get('/muncity/count', muncityController.count);

//------------------------FACILITY---------------------------------//

// Insert facility
router.post('/facility/insert', facilityController.insert);

// Update facility
router.post('/facility/update', facilityController.update);

// Delete facility
router.get('/facility/delete', facilityController.delete);

// Get facilities
router.get('/facility/get_facilities', facilityController.get_facilities);

// Get facility types
router.get('/facility/get_types', facilityController.get_types);

// Count facilities
router.get('/facility/count', facilityController.count);

//------------------------PROJECT---------------------------------//

// Insert project
router.post('/project/insert', projectController.insert);

// Count projects
router.get('/project/get_projects', projectController.get_projects);

// Get funding year
router.get('/project/get_funding_years', projectController.get_funding_years);

module.exports = router;