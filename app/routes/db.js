var express = require('express');

const credentials = require('../../credentials');

var mysql = require('mysql');
var router = express.Router();

console.log(credentials.mysql);

let dbConn;
try {
  dbConn = mysql.createConnection(credentials.mysql);

} catch (err) {
  console.log(err.message);
}

/**
 * Runs a SQL query based on the supplied query and parameters.
 * @param {String} statement SQL Statement to process
 * @param {Array<String>} params Parameters to sanitize and place into the SQL statement.
 */
function dbQuery(statement, params) {
  return new Promise((resolve, reject) => {
    dbConn.query(statement, params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    })
  })
}

/**
 * Get results based on starting words
 * @param {string} queryString String to search
 * @param {string} column Column to target search
 */
function headMatch(queryString, column) {
  return dbQuery(
    'SELECT * FROM tbl_trademark WHERE UPPER(' + column + ') LIKE ?',
    [queryString.toUpperCase() + '%']
  );
}

/**
* Get results based on matching string at any section of text.
* @param {string} queryString String to search
* @param {string} column Column to target search
*/
function otherMatch(queryString, column) {
  return dbQuery(
    'SELECT * FROM tbl_trademark WHERE UPPER(' + column + ') LIKE ? AND number NOT IN (SELECT number FROM tbl_trademark WHERE UPPER(' + column + ') LIKE ?)',
    [
      '%' + queryString.toUpperCase() + '%',
      queryString.toUpperCase() + '%'
    ]
  );

}
/* Get matching trademark names */
router.get('/query', async (req, res, next) => {
  const queryString = req.query.string;
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!req.query['string']) {
    res.send('No parameters passed.');

  } else {
    if (req.query.string.indexOf('*') >= 0) {
      // If search query contains a wildcard symbol, we take that as user defined and do not do our own processing.

      var sanitizedString = req.query.string.replace(/\*/g, '%');
      dbConn.query("SELECT * FROM tbl_trademark WHERE brand LIKE ? UNION SELECT * FROM tbl_trademark WHERE holder LIKE ?",
        [sanitizedString, sanitizedString], (err, result) => {
          if (err) throw err;
          res.send(result);
        });

    } else {
      // Workload that is placed on database server
      dbConn.query('SELECT * FROM tbl_trademark WHERE UPPER(brand) LIKE ? UNION SELECT * FROM tbl_trademark WHERE UPPER(brand) LIKE ? AND number NOT IN (SELECT number FROM tbl_trademark WHERE UPPER(brand) LIKE ?) UNION SELECT * FROM tbl_trademark WHERE UPPER(holder) LIKE ? UNION SELECT * FROM tbl_trademark WHERE UPPER(holder) LIKE ? AND number NOT IN (SELECT number FROM tbl_trademark WHERE UPPER(holder) LIKE ?)',
        [
          queryString.toUpperCase() + '%',
          '%' + queryString.toUpperCase() + '%',
          queryString.toUpperCase() + '%',
          queryString.toUpperCase() + '%',
          '%' + queryString.toUpperCase() +
          '%', queryString.toUpperCase() + '%'
        ], (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      )


      /**
       * // Workload that is placed on middleware server
       Promise.all([
         headMatch(req.query.string, 'brand'),
         headMatch(req.query.string, 'holder'),
         otherMatch(req.query.string, 'brand'),
         otherMatch(req.query.string, 'holder')
 
       ]).then((values) => {
         return new Array().concat(values[0], values[1], values[2], values[3]);
 
       }).then((arrValues) => {
         res.send(arrValues);
 
       });
        
       
       */

    }

  }
});

router.get('/random', (req, res) => {
  dbConn.query('SELECT * FROM trademarkprj.tbl_trademark ORDER BY RAND() LIMIT 1', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
})

module.exports = router;
