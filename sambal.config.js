const {blogPost$} = require("./js/blogPost");
const {aboutPage$} = require("./js/about");
const {blogCollection$} = require("./js/blogPostCollection");
const {SambalCollection, paginate, render, toHtml, template} = require("sambal");
const {collections, HOST, BLOG_ROOT, BLOGS_PER_PAGE, formatBlogListUrl, formatBlogListByTagUrl} = require("./js/constants");
const {from, of} = require("rxjs");
const {mergeMap, bufferCount, map, mergeAll, toArray, filter} = require("rxjs/operators");
const fs = require("fs");
const shelljs = require("shelljs");

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

const renderTags = ({partitions}) => {
    return template`
        <div class="p-4">
            <h4 class="font-italic">Tags</h4>
            <ul class="list-group">
                ${partitions.map(p => {
                    const key = p.partition.keywords;
                    const size = p.size;
                    return template `
                        <a href="${formatBlogListByTagUrl({groupBy: key, page: 1})}" class="list-group-item d-flex justify-content-between align-items-center">
                            ${key}
                            <span class="badge badge-primary badge-pill">${size}</span>
                        </a>
                    `;
                })}
            </ul>
        </div>
    `;
};

const store = new SambalCollection(collections);
const head = readFile("fragments/head.html");
const tags = from(store.stats("blogsByKeys"))
.pipe(render(renderTags))
.pipe(toHtml())
.toPromise();

const blogsByKeys = from(store.stats("blogsByKeys"))
.pipe(mergeMap(d => from(d.partitions)))
.pipe(mergeMap(d => (
    store.collection("blogsByKeys", d.partition)
    .pipe(bufferCount(BLOGS_PER_PAGE))
    .pipe(paginate())
    .pipe(map(page => ({...page, groupBy: d.partition.keywords})))
)))
.pipe(toArray())
.toPromise();

const latestBlogs = from(store.collection("latestBlogs"))
.pipe(bufferCount(BLOGS_PER_PAGE))
.pipe(paginate())
.pipe(toArray())
.toPromise();

function sitemap() {
    const blogsByKey$ = from(blogsByKeys)
    .pipe(mergeMap(pages => from(pages)))
    .pipe(map(page => formatBlogListByTagUrl(page)));

    const latestBlog$ = from(latestBlogs)
    .pipe(mergeMap(pages => from(pages)))
    .pipe(map(page => formatBlogListUrl(page)));
    
    const files = shelljs.ls("-R", BLOG_ROOT);
    const staticPage$ = from([
        '/about',
        ...files.filter(f => f.endsWith(".md")).map(f => (`/blog/${f.substring(0, f.length - 3)}`))
    ]);

    return from([latestBlog$, blogsByKey$, staticPage$]).pipe(mergeAll());
}

module.exports = {
    baseUrl: HOST,
    routes: [
        {path: '/', render: blogCollection$(latestBlogs, head, tags, formatBlogListUrl)},
        {path: '/about', render: aboutPage$(head)},
        {path: '/blog/:year/:file', render: blogPost$(head)},
        {path: '/blog/page/:page', render: blogCollection$(latestBlogs, head, tags, formatBlogListUrl)},
        {path: '/blog/tag/:tag/:page', render: blogCollection$(blogsByKeys, head, tags, formatBlogListByTagUrl)}
    ],
    sitemap$: sitemap()
};

from(latestBlogs)
.pipe(mergeMap(pages => from(pages)))
.pipe(filter(p => p.page === 1))
.pipe(mergeMap(p => from(p.items)))
.subscribe(d => console.log(d));

