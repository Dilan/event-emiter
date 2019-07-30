const router = require('express').Router();
const User = require('../models/User');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.get('/users', async(req, res) => {
    let items = await User.getList();
    res.status(200).json(items);
});

router.post('/users', async(req, res) => {
    let body = req.body;
    let doc;



    if (body.id) {
        doc = await User.update(body.id, body);
    } else {
        doc = await User.create(body);
    }

    setTimeout(() => {
        res.status(200).json(doc);
    }, 500)

});

module.exports = router;
