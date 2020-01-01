const {renderBlogPosts} = require("./js/blogPost");
const {renderAbout} = require("./js/page");
const {renderBlogPostCollection} = require("./js/blogPostCollection");
const {from} = require("rxjs");
const fs = require("fs");

function readFile(src) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

async function route(store) {
    const head = readFile("fragments/head.html");
    const content$ = store.content();
    const tagCollectionStats = await store.stats("blogsByKeys");
    return [
        renderBlogPosts(content$, head),
        renderBlogPostCollection(store, content$, tagCollectionStats, head),
        renderAbout(content$, head)
    ];
}

module.exports = {
    host: "https://chen4119.me",
    contentPath: "content",
    collections: [{
        name: "blogsByKeys",
        groupBy: "keywords",
        sortBy: [{field: "dateCreated", order: "desc"}]
    }],
    route$: route
};