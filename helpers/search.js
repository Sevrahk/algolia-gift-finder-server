const algoliasearch = require('algoliasearch');
const {isNil, endsWith} = require('lodash');

function search(searchQuery, page, filters, cb) {
    const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
    const index = client.initIndex(process.env.ALGOLIA_INDEX);

    let pageNumber = isNil(page) || isNaN(page) ? 0 : page;
    let strFilters = '';

    if(!isNil(filters)) {
        Object.keys(filters).map(function(key) {
            if(strFilters !== '')
                strFilters += ' AND';

            let symbol = ':';
            let strKey = key;

            if(endsWith(key, 'Min')) {
                if(isNaN(filters[key]))
                    return;

                symbol = '>=';
                strKey = key.substring(0, key.indexOf('Min'));
            }
            else if(endsWith(key, 'Max')) {
                if(isNaN(filters[key]))
                    return;

                symbol = '<=';
                strKey = key.substring(0, key.indexOf('Max'));
            }

            strFilters += ' ' + strKey + symbol + filters[key];
        });
    }

    index.search({
        getRankingInfo: true,
        query: searchQuery,
        page: pageNumber,
        filters: strFilters
    },
    (err, { hits, nbHits } = {}) => {
        cb(err, hits, nbHits);
    });
}

module.exports = search;
