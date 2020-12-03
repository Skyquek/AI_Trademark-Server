const credentials = require('../credentials');

var mysql = require('mysql');

module.exports.getdbConn = () => {
    try {
        console.log(credentials);
        return mysql.createConnection(credentials.mysql);
    
    } catch (err) {
        console.log(err.message);
    }

}