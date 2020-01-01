const {template, render, paginate, pushSchemaOrgJsonLd, toSchemaOrgJsonLd, toHtml} = require("sambal");
const {renderLayout, renderNavBar} = require("./layout");
const {of, from} = require("rxjs");
const {filter, bufferCount, map, mergeAll, mergeMap} = require("rxjs/operators");
const nodeUrl = require("url");

const BLOGS_PER_PAGE = 10;

const formatBlogListUrl = ({page}) => page === 1 ? "index.html" : `blogs/pages/page_${page}`;
const formatBlogListByTagUrl = ({groupBy, page}) => `blogs/tag/${encodeURIComponent(groupBy)}/page_${page}`;

const renderBlogPage = ({items, page, hasNext, groupBy, pageUrlFormatter}) => {
    return template`
        ${groupBy ? `<h1 class="header">Showing tag: ${groupBy}</h1>` : null}
        ${items.map((({headline, description, author, dateCreated, url}) => {
            const createdDate = new Date(dateCreated);
            return `
                <div class="blog-summary">
                    <a href="${nodeUrl.parse(url).pathname}">
                        <h2 class="blog-post-title">${headline}</h2>
                    </a>
                    <p class="blog-post-meta">${createdDate.toLocaleDateString()} ${author.name}</p>
                    <p>${description}</p>
                    <hr>
                </div>
            `;
        }))}
        <nav class="blog-pagination">
            <a class="btn btn-outline-primary ${hasNext ? '' : 'disabled'}" href="${hasNext ? pageUrlFormatter({page: page + 1, groupBy: groupBy}) : '#'}">Older</a>
            <a class="btn btn-outline-primary ${page === 1 ? 'disabled' : ''}" href="${page === 1 ? '#' : pageUrlFormatter({page: page - 1, groupBy: groupBy})}" tabindex="-1">Newer</a>
        </nav>
    `;
};

const renderBlogCollection = ({blogs, tags}) => {
    return template`
        <div class="row">
            <div class="col-md-8 blog-main">
                ${blogs}
            </div>
            <aside class="col-md-4">
                ${tags}
            </aside>
        </div>
    `;
};

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

function getBlogListRenderer(head, tags, pageUrlFormatter) {
    return (props) => {
        return renderLayout({
            css: props.css,
            head: head,
            nav: renderNavBar({isAbout: false}),
            content: renderBlogCollection({
                tags: tags,
                blogs: renderBlogPage({...props, pageUrlFormatter: pageUrlFormatter})
            })
        });
    };
}

function renderTagsComponent(partitions) {
    return of({partitions: partitions})
    .pipe(render(renderTags))
    .pipe(toHtml())
    .toPromise();
}

function blogPostList(obs$, head, tags, urlFormatter, groupBy) {
    return obs$
    .pipe(bufferCount(BLOGS_PER_PAGE))
    .pipe(paginate())
    .pipe(map(d => ({
        ...d,
        url: urlFormatter({groupBy: groupBy, page: d.page}),
        urls: d.items.map(item => item.url)
    })))
    .pipe(pushSchemaOrgJsonLd(d => toSchemaOrgJsonLd(d.urls, "BlogPosting")))
    .pipe(render(getBlogListRenderer(head, tags, urlFormatter)));
}

function renderBlogPostCollection(store, content$, tagCollectionStats, head) {
    const partitions = tagCollectionStats.partitions.filter(p => p.partition.keywords !== "");
    const tags = renderTagsComponent(partitions);

    const blogsByTag$ = from(partitions
    .map(p => blogPostList(store.collection("blogsByKeys", p.partition), head, tags, formatBlogListByTagUrl, p.partition.keywords)))
    .pipe(mergeAll());

    const blogPostObs$ = content$
    .pipe(filter(d => {
        return d.url !== "https://chen4119.me/about";
    }));
    const blogsList$ = blogPostList(blogPostObs$, head, tags, formatBlogListUrl);
    return [blogsList$, blogsByTag$];
}

module.exports = {
    renderBlogPostCollection: renderBlogPostCollection
};