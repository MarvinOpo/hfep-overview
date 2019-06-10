const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hfep_overview'
});

exports.insert_municipality = function (muncity) {

    return new Promise(function (resolve, reject) {
        let sql = "INSERT INTO municipality(name, province, district, mayor, population, MHO_CHO, PDOH, DMO, MUN_ENGR, LGU, POINT_PERSON) "
            + "values(?,?,?,?,?,?,?,?,?,?,?)";

        const values = [muncity.getName(), muncity.getProvince(), muncity.getDistrict(), muncity.getMayor(),
        muncity.getPopulation(), muncity.getMHO(), muncity.getPDOH(), muncity.getDMO(), muncity.getMunEngr(),
        muncity.getLGU(), muncity.getPointPerson()];

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("Insert failed"));

            resolve();
        });
    })

}

exports.update_municipality = function (muncity) {

    return new Promise(function (resolve, reject) {
        let sql = "UPDATE municipality SET name = ?, province = ?, district = ?, mayor = ?, population = ?, MHO_CHO = ?, PDOH = ?, DMO = ?, MUN_ENGR = ?, LGU = ?, POINT_PERSON = ? "
            + "WHERE id = ?";

        const values = [muncity.getName(), muncity.getProvince(), muncity.getDistrict(), muncity.getMayor(),
        muncity.getPopulation(), muncity.getMHO(), muncity.getPDOH(), muncity.getDMO(), muncity.getMunEngr(),
        muncity.getLGU(), muncity.getPointPerson(), muncity.getId()];

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("Update failed"));

            resolve();
        });
    })

}

exports.delete_municipality = function (id) {

    return new Promise(function (resolve, reject) {
        let sql = "DELETE FROM municipality WHERE id = ?";

        const values = [parseInt(id)];

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("Delete failed"));

            resolve();
        });
    })

}

exports.count_municipality = function (muncity) {

    return new Promise(function (resolve, reject) {
        let sql = "SELECT count(*) as count FROM municipality ";

        let whereClause = [];
        let values = [];

        if (muncity.getProvince()) {
            whereClause[whereClause.length] = "province = ? "
            values[values.length] = muncity.getProvince();
        }

        if  (muncity.getDistrict()) {
            whereClause[whereClause.length] = "district = ? "
            values[values.length] = muncity.getDistrict();
        }

        for(let i = 0; i < whereClause.length; i++){
            if(i == 0) sql += "WHERE "

            sql += whereClause[i];

            if(i < whereClause.length - 1) sql += "AND ";
        }

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("Count failed"));

            resolve(result);
        });
    })

}

exports.get_municipalities = function (muncity, offset, limit) {

    return new Promise(function (resolve, reject) {
        let sql = "SELECT * FROM municipality ";

        let whereClause = [];
        let values = [];

        if (muncity.getProvince()) {
            whereClause[whereClause.length] = "province = ? "
            values[values.length] = muncity.getProvince();
        }

        if  (muncity.getDistrict()) {
            whereClause[whereClause.length] = "district = ? "
            values[values.length] = muncity.getDistrict();
        }

        for(let i = 0; i < whereClause.length; i++){
            if(i == 0) sql += "WHERE "

            sql += whereClause[i];

            if(i < whereClause.length - 1) sql += "AND ";
        }

        values[values.length] = parseInt(offset);

        if(limit) sql += "ORDER BY ID LIMIT 5 OFFSET ?";
        else sql += "ORDER BY ID";

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("GET MUNICIPALITY failed"));

            resolve(result);
        });
    })

}

exports.get_districts = function (province) {

    return new Promise(function (resolve, reject) {
        let sql = "SELECT DISTINCT district, CONCAT( 'District ', district) AS 'label' FROM municipality ";

        if (province) {
            sql += "WHERE province = '" + province + "'";
        }

        sql += " ORDER BY CAST(district AS int)";

        connection.query(sql, function (err, result) {
            if (err) reject(new Error("GET DISTRICTS failed"));

            resolve(result);
        });
    })

}