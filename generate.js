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
    toSchemaOrgJsonLd,
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
.pipe(render(getBlogListRenderer(head, tags, formatBlogListUrl)))
.pipe(map(d => ({...d, data: {...d.data, items: d.data.items.map(item => item.url)}})))
.pipe(toSchemaOrgUrlList("data.items"))
.subscribe(packager.route(formatBlogListUrl));

blogSourceWithUrl
.pipe(groupAndPaginateBy(BLOGS_PER_PAGE, "keywords"))
.pipe(render(getBlogListRenderer(head, tags, formatBlogListByTagUrl)))
.pipe(map(d => ({...d, data: {...d.data, items: d.data.items.map(item => item.url)}})))
.pipe(toSchemaOrgUrlList("data.items"))
.subscribe(packager.route(formatBlogListByTagUrl));

blogSourceWithUrl
.pipe(render(getBlogPostRenderer(head)))
.pipe(toSchemaOrgJsonLd("BlogPosting", {field: "data", dest: "data.jsonld"}))
.pipe(setHtmlHeadMeta(HEAD_META_SELECTORS))
.subscribe(packager.route(formatBlogPostUrl));

aboutSource
.pipe(map(d => ({...d, url: `${HOST}/about.html`})))
.pipe(render(getAboutRenderer(head)))
.pipe(toSchemaOrgJsonLd("Person", {field: "data"}))
.pipe(setHtmlHeadMeta({
    ...HEAD_META_SELECTORS,
    title: "name",
    "og:title": "name",
    "twitter:title": "name"
}))
.subscribe(packager.route("about.html"));

blogSource.connect();
aboutSource.connect();





