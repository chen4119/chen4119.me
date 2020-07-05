const {template, render, pushJsonLd, toSchemaOrgJsonLd, loadJsonLd, loadContent} = require("sambal");
const {renderLayout, renderNavBar} = require("./layout");
const {HOST} = require("./constants");
const {of, from, forkJoin, zip} = require("rxjs");
const {map, mergeMap, filter, share, toArray} = require("rxjs/operators");

const renderBlogPage = ({items, page, hasNext, groupBy, pageUrlFormatter}) => {
    return template`
        ${groupBy ? `<h1 class="header">Showing tag: ${groupBy}</h1>` : null}
        ${items.map((({headline, description, author, dateCreated, url}) => {
            const createdDate = new Date(dateCreated);
            return `
                <div class="blog-summary">
                    <a href="${url}">
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

function blogCollection$(latestBlogs, head, tags, urlFormatter) {
    return ({path, params}) => {
        let pageNum = 1;
        if (params.page) {
            pageNum = +params.page;
        }
        const page$ = from(latestBlogs)
        .pipe(mergeMap(pages => from(pages)))
        .pipe(filter(d => {
            const groupByMatch = params.tag ? params.tag === d.groupBy : true;
            return groupByMatch && d.page === pageNum;
        }))
        .pipe(share());

        const blogUrl$ = page$
        .pipe(mergeMap(p => from(p.items)))
        .pipe(share());

        const loadBlog$ = blogUrl$
        .pipe(map(d => `content${d}.md`))
        .pipe(loadJsonLd({
            fetcher: (url) => loadContent(url)
        }));

        return forkJoin({
            page: page$,
            urls: blogUrl$.pipe(map(d => `${HOST}${d}`)).pipe(toArray()),
            blogs: zip(blogUrl$, loadBlog$).pipe(map(([url, blog]) => ({ ...blog, url: url }))).pipe(toArray())
        })
        .pipe(map(d => ({
            ...d.page,
            items: d.blogs,
            urls: d.urls
        })))
        .pipe(pushJsonLd(d => toSchemaOrgJsonLd(d.urls, "BlogPosting")))
        .pipe(render(getBlogListRenderer(head, tags, urlFormatter)));
    };
}


module.exports = {
    blogCollection$: blogCollection$
};