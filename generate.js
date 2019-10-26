// const {of, defer, forkJoin} = require("rxjs");
const {map, bufferCount} = require("rxjs/operators");
const {
    localFileMultiCast,
    render,
    Packager,
    paginate,
    aggregateBy,
    toSchemaOrgUrlList,
    groupAndPaginateBy,
    loadHtml,
    pushSchemaOrgJsonLd,
    toHtml,
    setHtmlHeadMeta
} = require("sambal-ssg");
const {
    getBlogPostRenderer,
    getBlogListRenderer,
    getAboutRenderer,
    renderTags,
    formatBlogPostUrl,
    formatBlogListUrl,
    formatBlogListByTagUrl
} = require("./js/templates");

const HOST = "https://chen4119.me";
const BLOGS_PER_PAGE = 10;

const packager = new Packager("./public");
packager
.clean()
.copy("node_modules/@fortawesome/fontawesome-free")
.copy("node_modules/jquery")
.copy("node_modules/bootstrap")
.copy("node_modules/prismjs");

const HEAD_META_SELECTORS = {
    title: "headline",
    "og:title": "headline",
    "twitter:title": "headline",
    description: "description",
    "og:description": "headline",
    "twitter:description": "headline"
};

const blogSource = localFileMultiCast("blogposts");
const aboutSource = localFileMultiCast("jsonld/me.yml");

const tags = blogSource
.pipe(aggregateBy("keywords"))
.pipe(render(renderTags))
.pipe(toHtml())
.toPromise();

const head = loadHtml("fragments/head.html");
const blogSourceWithUrl = blogSource.pipe(map(d => ({...d, url: `${HOST}/${formatBlogPostUrl(d)}`})));

blogSourceWithUrl
.pipe(bufferCount(BLOGS_PER_PAGE))
.pipe(paginate())
.pipe(map(d => ({...d, urls: d.items.map(item => item.url)})))
.pipe(toSchemaOrgUrlList("urls"))
.pipe(pushSchemaOrgJsonLd("ItemList", {field: "urls"}))
.pipe(render(getBlogListRenderer(head, tags, formatBlogListUrl)))
.subscribe(packager.route(formatBlogListUrl));

blogSourceWithUrl
.pipe(groupAndPaginateBy(BLOGS_PER_PAGE, "keywords"))
.pipe(map(d => ({...d, urls: d.items.map(item => item.url)})))
.pipe(toSchemaOrgUrlList("urls"))
.pipe(pushSchemaOrgJsonLd("ItemList", {field: "urls"}))
.pipe(render(getBlogListRenderer(head, tags, formatBlogListByTagUrl)))
.subscribe(packager.route(formatBlogListByTagUrl));

blogSourceWithUrl
.pipe(pushSchemaOrgJsonLd("BlogPosting"))
.pipe(render(getBlogPostRenderer(head)))
.pipe(setHtmlHeadMeta(HEAD_META_SELECTORS))
.subscribe(packager.route(formatBlogPostUrl));

aboutSource
.pipe(map(d => ({...d, url: `${HOST}/about.html`})))
.pipe(pushSchemaOrgJsonLd("Person"))
.pipe(render(getAboutRenderer(head)))
.pipe(setHtmlHeadMeta({
    ...HEAD_META_SELECTORS,
    title: "name",
    "og:title": "name",
    "twitter:title": "name"
}))
.subscribe(packager.route("about.html"));

blogSource.connect();
aboutSource.connect();





