// Router
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('You made a get request!');
    res.render('index');
});

router.post('/', (req, res) => {
    res.send('You made a post request!');
});

router.get('/data', (req, res) => {
    res.send('You made a get request for data!');
});

module.exports = router;