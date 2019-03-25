// Router
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('You made a get request!');
});

router.post('/', (req, res) => {
    res.send('You made a post request!');
});

module.exports = router;