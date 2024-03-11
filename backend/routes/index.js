var express = require('express');
var router = express.Router();
const axios = require('axios');
const connection = require('../Connection')


async function callApi() {
  try {
    const queryParams = {
      "client_id": "9a84128d-80ba-407f-a68f-80d2ab8697ef",
      "redirect_uri": "http://localhost:3000/",
      "response_type": "code",
      "scope": "",
      "state": 'cE5yRXKzmjv3L9g6dUZnNfCh0tB24o1bDxRJeOQs'
    }
    const headers = {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': '*',
      'X-Xss-Protection': '1; mode=block'

    };
    let baseUrl = 'https://accountsuat.frost.com/oauth/authorize'
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${baseUrl}?${queryString}`;
    let data = await axios.get(url, { "headers": headers })
    // console.log(data)
    // window.location.href = url;
  } catch (error) {
    console.log(error)
  }
}
/* GET home page. */
router.get('/auth/callback', async function (req, res, next) {
  //  console.log(req)
  //  console.log(res)
  // await callApi()
  res.json("kkkkkkk");
});

router.get('/allrecords', async (req, res) => {
  try {
    const result = await connection.query('SELECT * FROM regions;');
    // console.log(result.length)
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
