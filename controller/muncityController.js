const Municipality = require('../model/Municipality.js');
const muncityAPI = require('../api/municipalAPI');

exports.insert = async function (req, res) {
    let muncity = new Municipality();
    muncity.setName(req.body.name);
    muncity.setProvince(req.body.province);
    muncity.setDistrict(req.body.district);
    muncity.setMayor(req.body.mayor);
    muncity.setPopulation(req.body.population);
    muncity.setMHO(req.body.mho);
    muncity.setPDOH(req.body.pdoh);
    muncity.setDMO(req.body.dmo);
    muncity.setMunEngr(req.body.mun_engr);
    muncity.setLGU(req.body.LGU);
    muncity.setPointPerson(req.body.point_person);

    try {
        await muncityAPI.insert_municipality(muncity);
        res.send("success");
    } catch (err) {
        res.send("error");
    }
};


exports.update = async function (req, res) {
    let muncity = new Municipality();
    muncity.setId(req.body.id);
    muncity.setName(req.body.name);
    muncity.setProvince(req.body.province);
    muncity.setDistrict(req.body.district);
    muncity.setMayor(req.body.mayor);
    muncity.setPopulation(req.body.population);
    muncity.setMHO(req.body.mho);
    muncity.setPDOH(req.body.pdoh);
    muncity.setDMO(req.body.dmo);
    muncity.setMunEngr(req.body.mun_engr);
    muncity.setLGU(req.body.LGU);
    muncity.setPointPerson(req.body.point_person);

    try {
        await muncityAPI.update_municipality(muncity);
        res.send("success");
    } catch (err) {
        res.send("error");
    }
};

exports.delete = async function (req, res) {
    try {
        await muncityAPI.delete_municipality(req.query.id);
        res.send("success");
    } catch (err) {
        res.send("error");
    }
};

exports.count = async function (req, res) {
    let muncity = new Municipality();
    muncity.setProvince(req.query.province);
    muncity.setDistrict(req.query.district);

    try {
        const count = await muncityAPI.count_municipality(muncity);
        res.send(count);
    } catch (err) {
        let result = {};
        result['status'] = 'error';
        res.send(result);
    }
};

exports.get_municipalities = async function (req, res){
    let muncity = new Municipality();
    muncity.setProvince(req.query.province);
    muncity.setDistrict(req.query.district);

    try{
        const municipals = await muncityAPI.get_municipalities(muncity, req.query.offset, req.query.limit);
        res.send(municipals);
    }catch (err){
        res.send("error");
    }
};

exports.get_districts = async function (req, res){
    try{
        const districts = await muncityAPI.get_districts(req.query.province);
        res.send(districts);
    }catch (err){
        res.send("error");
    }
};