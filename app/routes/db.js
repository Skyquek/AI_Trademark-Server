var express = require('express');

const utils = require('../utils');
const credentials = require('../../credentials');

var router = express.Router();

/**
 * Runs a SQL query based on the supplied query and parameters.
 * @param {String} statement SQL Statement to process
 * @param {Array<String>} params Parameters to sanitize and place into the SQL statement.
 */
function dbQuery(statement, params) {
  return new Promise((resolve, reject) => {
    const dbConn = utils.getdbConn();
    dbConn.query(statement, params, (err, result) => {
      dbConn.end();
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

/**
 * Get results based on string
 * @param {string} queryString String to search
 * @param {string} column Column to target search
 */
function exactMatch(queryString, column) {
  return dbQuery(
    'SELECT * FROM tbl_trademark WHERE UPPER(' + column + ')=?',
    [queryString.toUpperCase()]
  );
}

/* Get matching trademark names */
router.get('/search', async (req, res, next) => {
  var pre_query = new Date().getTime();

  const queryString = req.query.string;
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!req.query['string']) {
    res.send('No parameters passed.');

  } else {
    if (req.query.string.indexOf('*') >= 0) {
      // If search query contains a wildcard symbol, we take that as user defined and do not do our own processing.

      var sanitizedString = req.query.string.replace(/\*/g, '%');
      const dbConn = utils.getdbConn();
      dbConn.query("SELECT * FROM tbl_trademark WHERE brand LIKE ? UNION SELECT * FROM tbl_trademark WHERE holder LIKE ?",
        [sanitizedString, sanitizedString], (err, result) => {
          dbConn.end();

          if (err) console.log(err);

          var post_query = new Date().getTime();

          console.log((post_query - pre_query) / 1000);

          res.send({
            responseTime: (post_query - pre_query) / 1000,
            results: result
          });
        });

    } else {
      // Workload that is placed on database server
      const dbConn = utils.getdbConn();
      dbConn.query('SELECT * FROM tbl_trademark WHERE UPPER(brand) LIKE ? UNION SELECT * FROM tbl_trademark WHERE UPPER(brand) LIKE ? AND number NOT IN (SELECT number FROM tbl_trademark WHERE UPPER(brand) LIKE ?) UNION SELECT * FROM tbl_trademark WHERE UPPER(holder) LIKE ? UNION SELECT * FROM tbl_trademark WHERE UPPER(holder) LIKE ? AND number NOT IN (SELECT number FROM tbl_trademark WHERE UPPER(holder) LIKE ?)',
        [
          queryString.toUpperCase() + '%',
          '%' + queryString.toUpperCase() + '%',
          queryString.toUpperCase() + '%',
          queryString.toUpperCase() + '%',
          '%' + queryString.toUpperCase() +
          '%', queryString.toUpperCase() + '%'
        ], (err, result) => {
          dbConn.end();
          if (err) console.log(err);

          var post_query = new Date().getTime();

          console.log((post_query - pre_query) / 1000);

          result = {
            responseTime: (post_query - pre_query) / 1000,
            results: result
          }

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

router.get('/holder/:name', (req, res) => {
  console.log(req.params.name);
  exactMatch(req.params.name, 'holder').then((response) => {
    res.send(response);
  })
})

router.get('/trademark/:id', (req, res) => {
  console.log(req.params.id);
  exactMatch(req.params.id, 'number').then((response) => {
    res.send(response);
  });

});

router.get('/random', (req, res) => {
  const dbConn = utils.getdbConn();
  dbConn.query('SELECT * FROM trademarkprj.tbl_trademark ORDER BY RAND() LIMIT 1', (err, result) => {
    dbConn.end();
    if (err) throw err;
    res.send(result);
  });
})

module.exports = router;
