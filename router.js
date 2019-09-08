const cors = require('cors');
const queryChecker = require('./middlewares/queryChecker');
const index = require('./routes/index');
const webhook = require('./routes/search');

function routes(app) {
    app.options('*', cors());

    app.use('/', cors(), index);
    app.use('/search', cors(), queryChecker, webhook);
}

module.exports = routes;
