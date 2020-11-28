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

/* Get matching trademark names */
router.get('/query', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!req.query['string']) {
    res.send('No parameters passed.');

  } else {
    if (req.query.string.indexOf('*') >= 0) {
      // If search query contains a wildcard symbol, we take that as user defined and do not do our own processing.

      var sanitizedString = req.query.string.replace(/\*/g, '%');
      console.log(sanitizedString);
      dbConn.query("SELECT * FROM tbl_trademark WHERE brand LIKE ?",
        [sanitizedString], (err, result) => {
          if (err) throw err;
          res.send(result);
        });

    } else {
      /**
       * Get results based on starting words
       * @param {string} queryString String to search
       */
      function headMatch(queryString) {
        return new Promise((resolve, reject) => {
          dbConn.query("SELECT * FROM tbl_trademark WHERE UPPER(brand) LIKE ?",
            [queryString.toUpperCase() + '%'], (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
        });
      }

      /**
      * 
      * @param {string} queryString String to search
      */
      function otherMatch(queryString) {
        return new Promise((resolve, reject) => {
          dbConn.query("SELECT * FROM tbl_trademark WHERE UPPER(brand) LIKE ? AND number NOT IN (SELECT number FROM tbl_trademark WHERE UPPER(brand) LIKE ?)",
            ['%' + queryString.toUpperCase() + '%', queryString.toUpperCase() + '%'],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            });

        })
      }

      Promise.all([headMatch(req.query.string), otherMatch(req.query.string)]).then((values) => {
        return values[0].concat(values[1]);
      }).then((arrValues) => {
        res.send(arrValues);
      });

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
