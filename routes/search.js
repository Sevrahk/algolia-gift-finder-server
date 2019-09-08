var express = require('express');
var router = express.Router();
const search = require('../helpers/search');
const _ = require('lodash');
const stringSimilarity = require('string-similarity');

router.post('/', function(req, res, next) {
    search(req.body.search, req.body.page, req.body.filters, function(err, hits, nbHits) {
        if (err)
            throw err;

        let hitsWithTypos = _.filter(hits, function(o) { return o._rankingInfo.nbTypos > 0; });
        let spellFix = null;

        if(hitsWithTypos.length > 0) {
            let searchWords = req.body.search.trim().split(/\s+/);
            let goodWords = [];
            let matchedWords = [];
            hitsWithTypos.forEach(hit => {
                goodWords = _.merge(goodWords, getWords(hit._highlightResult.name.value), getWords(hit._highlightResult.brand.value));
                matchedWords = _.merge(matchedWords, hit._highlightResult.name.matchedWords, hit._highlightResult.brand.matchedWords);
            });

            matchedWords.forEach(word => {
                let match = stringSimilarity.findBestMatch(word, goodWords);
                let searchWordIndex = _.indexOf(searchWords, word);
                searchWords[searchWordIndex] = goodWords[match.bestMatchIndex];
            });

            spellFix = searchWords.join(' ');
        }

        return res.json({
            hits: hits,
            nbHits: nbHits,
            spellFix: spellFix
        });
    });
});

function getWords(str) {
    let words = str.trim().split(/\s+/);
    words = _.filter(words, function(o) {
        return o.match(/<em>.*<\/em>/);
    });

    words = words.map(function (word) {
        return word.replace(/<em>|<\/em>/g, '');
    });

    return words;
}

module.exports = router;
