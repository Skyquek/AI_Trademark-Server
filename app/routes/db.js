var express = require('express');
const credentials = require('../../credentials');
var mysql = require('mysql');
var router = express.Router();

console.log(credentials.mysql);

let myConn;
try{
  myConn = mysql.createConnection(credentials.mysql)
  
}catch(err){
  console.log(err.message);
}


/* GET home page. */
router.get('/checkAlive', function(req, res, next) {
  res.status(200).send(true);
});

router.get('/query', (req, res, next) => {
  params = req.params;
  console.log(req.params);
})

module.exports = router;
