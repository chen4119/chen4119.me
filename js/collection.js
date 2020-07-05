const shelljs = require("shelljs");
const {from, forkJoin, of} = require("rxjs");
const {map, filter, mergeMap} = require("rxjs/operators");
const {SambalCollection, loadJsonLd} = require("sambal");
const {collections, BLOG_ROOT} = require("./constants");

const docs = shelljs.ls("-R", BLOG_ROOT);
const content$ = from(docs)
.pipe(filter(uri => uri.endsWith(".md")))
.pipe(mergeMap(uri => forkJoin({
    url: of(`/blog/${uri.substring(0, uri.length - 3)}`),
    data: of(`${BLOG_ROOT}/${uri}`).pipe(loadJsonLd())
})))
.pipe(map(d => ({
    url: d.url,
    ...d.data
})));

(async () => {
    try {
        const indexer = new SambalCollection(collections);
        await indexer.indexContent(content$);
    } catch (e) {
        console.log(e);
    }
})();