const {isObject, has} = require('lodash');

function queryChecker(req, res, next) {
    if(!isObject(req.body) || !has(req.body, 'search'))
        return res.status(400).end('Missing search parameter');

    next();
}

module.exports = queryChecker;
