const Project = require('../model/Project.js');
const projAPI = require('../api/projectAPI');

exports.insert = async function (req, res) {
    let project = new Project();
    project.setFacilityId(req.body.facility);
    project.setContractorId(req.body.contractor);
    project.setName(req.body.name);
    project.setSource(req.body.source);
    project.setYear(req.body.year);
    project.setAllotment(req.body.allotment);
    project.setAgency(req.body.agency);
    project.setStartDate(req.body.start_date);
    project.setEndDate(req.body.end_date);
    project.setStatus(req.body.status);
    project.setImages(JSON.stringify(req.body.images));
    project.setRemarks(req.body.remarks);

    let result = {};

    try {
        await projAPI.insert_project(project);
        result['status'] = 'success';
        res.send(result);
    } catch (err) {
        result['status'] = 'error';
        res.send(result);
    }
}

exports.get_projects = async function (req, res) {

    let project = new Project();
    project.setFacilityId(req.query.facility);
    project.setSource(req.query.source);
    project.setYear(req.query.year);

    try {
        const projects = await projAPI.get_projects(project, req.query.province, req.query.muncity);
        res.send(projects);
    } catch (err) {
        let result = {};
        result['status'] = 'error';
        res.send(result);
    }
};

exports.get_funding_years = async function (req, res) {
    try {
        const years = await projAPI.get_funding_years(req.query.facilityId)
        res.send(years);
    } catch (err) {
        let result = {};
        result['status'] = 'error';
        result['message'] = err;
        res.send(result);
    }
}