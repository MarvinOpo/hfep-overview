const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hfep_overview'
});

exports.insert_facility = function (facility) {

    return new Promise(function (resolve, reject) {
        let sql = "INSERT INTO facility(muncity_id, name, address, license, no_of_bed, type) "
            + "values(?,?,?,?,?,?)";

        const values = [facility.getMuncity(), facility.getName(), facility.getAddress(),
        facility.getLicense(), facility.getBedsNo(), facility.getType()];

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("Insert failed"));

            resolve();
        });
    })
}

exports.update_facility = function (facility) {

    return new Promise(function (resolve, reject) {
        let sql = "UPDATE facility SET muncity_id = ?, name = ?, address = ?, license = ?, no_of_bed = ?, type = ? "
            + "WHERE id = ?";

        const values = [facility.getMuncity(), facility.getName(), facility.getAddress(),
        facility.getLicense(), facility.getBedsNo(), facility.getType(), facility.getId()];

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("Update failed"));

            resolve();
        });
    })

}

exports.delete_facility = function (id) {

    return new Promise(function (resolve, reject) {
        let sql = "DELETE FROM facility WHERE id = ?";

        const values = [parseInt(id)];

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("Delete failed"));

            resolve();
        });
    })

}

exports.get_facilities = function (facility, offset) {

    return new Promise(function (resolve, reject) {
        let sql = "SELECT f.*, m.name AS muncity FROM facility AS f INNER JOIN municipality AS m "
            + "WHERE f.muncity_id = m.id ";

        let values = [];

        if (facility.getMuncity()) {
            sql += "AND f.muncity_id = ? "
            values[values.length] = facility.getMuncity();
        }

        if (facility.getType()) {
            sql += "AND f.type = ? "
            values[values.length] = facility.getType();
        }

        sql += "ORDER BY ID "

        if(offset){
            sql += " LIMIT 5 OFFSET ?";
            values[values.length] = parseInt(offset);
        }
        
        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("GET FACILITY failed"));

            resolve(result);
        });
    })

}

exports.get_types = function (muncity_id) {

    return new Promise(function (resolve, reject) {
        let sql = "SELECT DISTINCT type FROM facility ";

        if (muncity_id) {
            sql += "WHERE muncity_id = '" + muncity_id + "'";
        }

        sql += " ORDER BY type";

        connection.query(sql, function (err, result) {
            if (err) reject(new Error("GET TYPES failed"));

            resolve(result);
        });
    })

}

exports.count_facilities = function (facility) {

    return new Promise(function (resolve, reject) {
        let sql = "SELECT count(*) as count FROM facility ";

        let whereClause = [];
        let values = [];

        if (facility.getMuncity()) {
            whereClause[whereClause.length] = "muncity_id = ? "
            values[values.length] = facility.getMuncity();
            
        }

        if (facility.getType()) {
            whereClause[whereClause.length] = "type = ? "
            values[values.length] = facility.getType();
        }

        if(whereClause.length > 0){
            sql += "WHERE "

            for(let i = 0; i < whereClause.length; i++){
                sql += whereClause[i];
    
                if(i < whereClause.length - 1) sql += "AND ";
            }
        }
        

        connection.query(sql, values, function (err, result) {
            if (err) reject(new Error("GET COUNT FACILITY failed"));

            resolve(result);
        });
    })

}