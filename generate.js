const {of, defer, forkJoin} = require("rxjs");
const {map, bufferCount, pluck} = require("rxjs/operators");
const fs = require("fs");
const {schemaOrgMultiCast, layout, render, Packager, paginate, aggregateBy, toSchemaOrgItemList, groupAndPaginateBy} = require("sambal-ssg");
const {renderLayout, renderAbout, renderBlogPage, renderBlogCollection, renderTags, renderNavBar, renderBlogPost} = require("./js/templates");

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

const packager = new Packager("./public");
packager
.clean()
.copy("node_modules/@fortawesome/fontawesome-free")
.copy("node_modules/jquery")
.copy("node_modules/bootstrap")
.copy("node_modules/prismjs");


const blogSource = schemaOrgMultiCast("blogposts");

const tags = blogSource
.pipe(aggregateBy("jsonld.keywords"))
.pipe(render(renderTags))
.pipe(pluck('html'))
.toPromise();

function renderToRoute(src, route) {
    src
    .pipe(layout({
        tags: tags,
        blogs: renderBlogPage
    }))
    .pipe(layout({
        head: readFile("fragments/head.html"),
        nav: renderNavBar,
        content: renderBlogCollection
    }))
    .pipe(render(renderLayout))
    .subscribe(packager.route(route));
}


const blogList = blogSource
.pipe(bufferCount(3))
.pipe(paginate())
.pipe(toSchemaOrgItemList("data"));

renderToRoute(blogList, "page-${page}.html");

/*
const blogByTag = blogSource
.pipe(groupAndPaginateBy(3, "jsonld.keywords"))
.pipe(toSchemaOrgItemList("data"))

renderToRoute(blogByTag, "${groupBy}-${page}.html");*/

blogSource
.pipe(layout({
    head: readFile("fragments/head.html"),
    nav: renderNavBar,
    content: renderBlogPost
}))
.pipe(render(renderLayout))
.subscribe(packager.route("${jsonld.identifier}.html"));



blogSource.connect();





