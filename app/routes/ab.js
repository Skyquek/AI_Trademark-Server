var express = require('express');
var axios = require('axios');

const utils = require('../utils');
const credentials = require('../../credentials');

var router = express.Router();

const aiBackend = 'http://128.199.159.89:7000/';

router.get('/compare', (req, res) => {
    var pre_query = new Date().getTime();
    res.setHeader("Access-Control-Allow-Origin", "*");
    // console.log(`Start compare ${req.query.q1}, ${req.query.q2}`);
    comparePhonetic(req.query.q1, req.query.q2).then((result) => {
        var post_query = new Date().getTime();
        res.send({
            success: true,
            responseTime: (post_query - pre_query) / 1000,
            results: result
        });
    }).catch(err => {
        // console.log(err);
        res.send({ success: false });
    });

    // res.send({ "responseTime": 3.226, "results": { "image_title1": "static/phonetic/image/NIKE.png", "image_title2": "static/phonetic/image/NIKI.png", "image_title_combined": "static/phonetic/image_test/NIKE.NIKI.0.png", "percentage_difference": 0.03, "tm1": "NIKE", "tm2": "NIKI", "result_phonetic": "Similar Phonetic", "confidence_phonetic": "100.00%", "phonetic_similar": true, "word1_list": [0, 43, 5, 18, 4, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47], "word2_list": [0, 43, 5, 18, 5, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47] } });
})

function comparePhonetic(q1, q2) {
    return new Promise((resolve, reject) => {
        // console.log('Start ' + q1 + ' vs ' + q2);
        axios.get('http://128.199.159.89:7000/search/ab/', {
            params: {
                q1: q1,
                q2: q2
            }
        }).then((response) => {
            // console.log('Settle ' + q1 + ' vs ' + q2);
            // console.log(response.data.result_phonetic + ' @ ' + response.data.confidence_phonetic)
            resolve(response.data);


        }).catch((err) => {
            if (err.response) {
                console.log(err.response.status + ": " + err.response.statusText + " - " + err.request.path);

            } else {
                console.log(err.code + ": " + err.config.url);
            }
            reject(err);
        })

    })
}

module.exports = router;

