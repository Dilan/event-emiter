const router = require('express').Router();
const User = require('../models/User');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.get('/', async(req, res) => {
    let items = await User.getList();
    res.status(200).json(items);
});

// curl -X DELETE "http://127.0.0.1:5001/api/users?department=SWE"
router.delete('/', async(req, res) => {
    let result = await User.deleteMany(req.query);
    res.status(200).json(result);
});

router.post('/', async(req, res) => {
    let body = req.body;
    let doc;

    if (body.id)
        doc = await User.update(body.id, body);
    else
        doc = await User.create(body);

    // emulate delay
    setTimeout(() => {
        res.status(200).json(doc);
    }, 500)
});

module.exports = router;
