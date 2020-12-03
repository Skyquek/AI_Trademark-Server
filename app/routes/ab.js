var express = require('express');
var axios = require('axios');

const utils = require('../utils');
const credentials = require('../../credentials');

var router = express.Router();

const aiBackend = 'http://128.199.159.89:7000/';


router.get('/compare', (req, res) => {
    // req.query
})

/**
 * Runs the promises one by one, waiting it to solve before running the next.
 * Source: https://stackoverflow.com/questions/24586110/resolve-promises-one-after-another-i-e-in-sequence
 * @param {array} objects_array The array of objects to be iterated across.
 * @param {function} iterator Function to run across the iterations.
 * @param {callback} callback
 * @return {Promise[]}
 */
module.exports.one_by_one = (objects_array, iterator, callback) => {
    var start_promise = objects_array.reduce((prom, object) => {
        return prom.then(() => {
            return iterator(object);
        });
    }, Promise.resolve()); // initialize with a resolved promise

    if (callback) {
        start_promise.then(callback);
    } else {
        return start_promise;
    }
}

// Chunk up array
function chunk(array, size) {
    const chunked_arr = [];
    let copied = [...array]; // ES6 destructuring
    const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
    for (let i = 0; i < numOfChild; i++) {
        chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
}

function comparePhonetic(q1, q2) {
    return new Promise((resolve, reject) => {
        console.log('Start ' + q1 + ' vs ' + q2);
        axios.get('http://128.199.159.89:7000/search/ab/', {
            params: {
                q1: q1,
                q2: q2
            }
        }).then((response) => {
            console.log('Settle ' + q1 + ' vs ' + q2);
            console.log(response.data.result_phonetic + ' @ ' + response.data.confidence_phonetic)
            resolve(response.data);


        }).catch((err) => {
            console.log(err);
            reject(err);
        })

    })
}

router.get('/findMatching', (req, res) => {
    var pre_query = new Date().getTime();
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (!req.query['sourceString']) {
        res.send('Invalid format');
    } else {
        const dbConn = utils.getdbConn();
        dbConn.query('SELECT number, brand FROM tbl_trademark LIMIT 5', (err, results) => {
            if (err) reject(err);

            dbConn.end();

            // This is for future concurrent connections feature
            // const resultsArr = chunk(results, Math.ceil(results.length / credentials.abConcurrent));
            // console.log(resultsArr.length);

            var phoneticResults = [];
            this.one_by_one(results, async (result) => {
                const data = await comparePhonetic(req.query.sourceString, result.brand);
                // res.write(data);
                phoneticResults.push(data);
            }).then(() => {
                var post_query = new Date().getTime();
                res.send({
                    responseTime: (post_query - pre_query) / 1000,
                    results: phoneticResults
                });

            });
        })
        // TODO: Send out using streams such that the user can see results as the program progresses

    }
});


module.exports = router;