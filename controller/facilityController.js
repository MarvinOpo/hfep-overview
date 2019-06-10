const Facility = require('../model/Facility.js');
const facAPI = require('../api/facilityAPI');

exports.insert = async function (req, res) {
    let facility = new Facility();
    facility.setMuncity(req.body.muncity);
    facility.setName(req.body.name);
    facility.setAddress(req.body.address);
    facility.setLicense(req.body.license);
    facility.setBedsNo(req.body.beds);
    facility.setType(req.body.type);

    let result = {};

    try {
        await facAPI.insert_facility(facility);
        result['status'] = 'success';
        res.send(result);
    } catch (err) {
        result['status'] = 'error';
        res.send(result);
    }
};

exports.update = async function (req, res) {
    let facility = new Facility();
    facility.setId(req.body.id)
    facility.setMuncity(req.body.muncity);
    facility.setName(req.body.name);
    facility.setAddress(req.body.address);
    facility.setLicense(req.body.license);
    facility.setBedsNo(req.body.beds);
    facility.setType(req.body.type);

    let result = {};

    try {
        await facAPI.update_facility(facility);
        result['status'] = 'success';
        res.send(result);
    } catch (err) {
        result['status'] = 'error';
        res.send(result);
    }
};

exports.delete = async function (req, res) {
    let result = {};

    try {
        await facAPI.delete_facility(req.query.id);
        result['status'] = 'success';
        res.send(result);
    } catch (err) {
        result['status'] = 'error';
        res.send(result);
    }
};

exports.count = async function (req, res) {
    let facility = new Facility();
    facility.setMuncity(req.query.muncity);
    facility.setType(req.query.type);

    try {
        const count = await facAPI.count_facilities(facility);
        res.send(count);
    } catch (err) {
        let result = {};
        result['status'] = 'error';
        res.send(result);
    }
};

exports.get_facilities = async function (req, res) {
    let facility = new Facility();
    facility.setMuncity(req.query.muncity);
    facility.setType(req.query.type);

    try {
        const facilities = await facAPI.get_facilities(facility, req.query.offset);
        res.send(facilities);
    } catch (err) {
        let result = {};
        result['status'] = 'error';
        result['message'] = err;
        res.send(result);
    }
};

exports.get_types = async function (req, res){
    try{
        const types = await facAPI.get_types(req.query.muncity);
        res.send(types);
    }catch (err){
        let result = {};
        result['status'] = 'error';
        res.send(result);
    }
};