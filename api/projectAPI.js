const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hfep_overview'
});

exports.insert_project = function (project) {
    return new Promise(function (resolve, reject) {
        let sql = "INSERT INTO project (facility_id, contractor_id, name, fund_source, funding_year, allotment, agency, mayor, start_date, end_date, status, images, remarks) "
            + "values (?,?,?,?,?,?,?,(SELECT mayor FROM municipality WHERE id = (SELECT muncity_id FROM facility WHERE id = " + parseInt(project.facilityId) + ")),?,?,?,?,?)"

        const values = [project.getFacilityId(), project.getContractorId(), project.getName(), project.getSource(),
        project.getYear(), project.getAllotment(), project.getAgency(), project.getStartDate(), project.getEndDate(),
        project.getStatus(), project.getImages(), project.getRemarks()];

        connection.query(sql, values, function (err, result) {
            console.log(err);
            if (err) reject(new Error("Insert failed"));

            resolve();
        });
    })
}

exports.get_projects = function (project, province, muncity) {

    return new Promise(function (resolve, reject) {
        let sql = "SELECT *, (SELECT CONCAT(name, ', ', address, '***', (SELECT CONCAT(name, ', ', province) FROM municipality m WHERE id = f.muncity_id)) FROM facility f WHERE id = project.facility_id) as facility FROM project ";

        let whereClause = [];
        let values = [];

        if (province) {
            whereClause[whereClause.length] = "facility_id IN (SELECT id FROM facility WHERE muncity_id IN (SELECT id FROM municipality WHERE province = ?)) "
            values[values.length] = province;
        }

        if (muncity) {
            whereClause[whereClause.length] = "facility_id IN (SELECT id FROM facility WHERE muncity_id = ?) "
            values[values.length] = muncity;
        }

        if (project.getFacilityId()) {
            whereClause[whereClause.length] = "facility_id = ? "
            values[values.length] = project.getFacilityId();

        }

        if (project.getSource()) {
            whereClause[whereClause.length] = "fund_source = ? "
            values[values.length] = project.getSource();
        }

        if (project.getYear()) {
            whereClause[whereClause.length] = "funding_year = ? "
            values[values.length] = project.getYear();
        }

        if (whereClause.length > 0) {
            sql += "WHERE "

            for (let i = 0; i < whereClause.length; i++) {
                sql += whereClause[i];

                if (i < whereClause.length - 1) sql += "AND ";
            }
        }

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("GET COUNT PROJECT failed"));

            resolve(result);
        });
    })

}

exports.get_funding_years = function (facilityId) {
    return new Promise(function (resolve, reject) {
        let sql = "SELECT DISTINCT funding_year FROM project ";

        if (facilityId) {
            sql += "WHERE facility_id = " + facilityId;
        }

        sql += " ORDER BY funding_year DESC"

        connection.query(sql, function (err, result) {
            if (err) reject(new Error("GET funding year failed"));

            resolve(result);
        });
    })
}