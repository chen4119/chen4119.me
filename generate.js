const {of, defer, forkJoin} = require("rxjs");
const {map, bufferCount, pluck} = require("rxjs/operators");
const {localFileMultiCast, render, Packager, paginate, aggregateBy, toSchemaOrgItemList, groupAndPaginateBy, loadHtml, hydrateJsonLd, toSchemOrgJsonLd, toHtml} = require("sambal-ssg");
const {getBlogPostRenderer, getBlogListRenderer, getAboutRenderer, renderTags} = require("./js/templates");


const packager = new Packager("./public");
packager
.clean();
/*
.copy("node_modules/@fortawesome/fontawesome-free")
.copy("node_modules/jquery")
.copy("node_modules/bootstrap")
.copy("node_modules/prismjs");
*/

const blogSource = localFileMultiCast("blogposts/two-common-gotchas-in-react.md");
const aboutSource = localFileMultiCast("jsonld/me.yml");

const tags = blogSource
.pipe(aggregateBy("keywords"))
.pipe(render(renderTags))
.pipe(toHtml())
.toPromise();

const head = loadHtml("fragments/head.html");

/*
blogSource
// .pipe(toSchemOrgJsonLd("BlogPosting"))
.pipe(bufferCount(3))
.pipe(paginate())
.pipe(render(getBlogListRenderer(head, tags)))
.pipe(toSchemOrgJsonLd("BlogPosting", {field: "data.items"}))
.pipe(toSchemaOrgItemList("data.items"))
.subscribe(d => console.log(d.data));
// .subscribe(packager.route("pages/page-${page}.html"));


blogSource
.pipe(groupAndPaginateBy(3, "keywords"))
.pipe(render(getBlogListRenderer(head, tags)))
.subscribe(packager.route("tags/${groupBy}/${page}.html"));

blogSource
.pipe(render(getBlogPostRenderer(head)))
.subscribe(packager.route("${year}/${id}.html"));
*/

aboutSource
.pipe(render(getAboutRenderer(head)))
.pipe(toSchemOrgJsonLd("Person", {field: "data"}))
.subscribe(d => console.log(d));

// .subscribe(packager.route("about.html"));


blogSource.connect();
aboutSource.connect();





