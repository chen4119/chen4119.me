const {template} = require("sambal-ssg");

const formatBlogPostUrl = ({year, id}) => `blogs/${year}/${id}.html`;
const formatBlogListUrl = ({page}) => page === 1 ? "index.html" : `blogs/pages/${page}.html`;
const formatBlogListByTagUrl = ({groupBy, page}) => `blogs/tag/${groupBy}/${page}.html`;

const renderLayout = ({head, nav, content}) => {
    return template`
        <!DOCTYPE html>
        <html>
            <head>
                ${head}
            </head>
            <body>
                ${nav}
                <main role="main" class="container main">
                    ${content}
                </main>
            </body>
        </html>
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

const renderBlogPage = ({items, page, hasNext, groupBy, pageUrlFormatter}) => {
    return template`
        ${groupBy ? `<h1 class="header">Showing tag: ${groupBy}</h1>` : null}
        ${items.map((({headline, description, author, dateCreated, year, id}) => {
            const createdDate = new Date(dateCreated);
            return `
                <div class="blog-summary">
                    <a href="${formatBlogPostUrl({year: year, id: id})}">
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

const renderNavBar = ({isAbout}) => {
    const homepage = "index.html";
    return template`
        <nav class="navbar navbar-expand-md navbar-light bg-light fixed-top">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="${homepage}">Home</a>
                    </li>
                    <li class="nav-item ${isAbout ? 'active' : null}">
                        <a class="nav-link" href="about.html">About</a>
                    </li>
                </ul>
            </div>
        </nav>
    `;
}

const renderTags = (tags) => {
    return template`
        <div class="p-4">
            <h4 class="font-italic">Tags</h4>
            <ul class="list-group">
                ${tags.map(tag => `
                    <a href="${formatBlogListByTagUrl({groupBy: tag.key, page: 1})}" class="list-group-item d-flex justify-content-between align-items-center">
                        ${tag.key}
                        <span class="badge badge-primary badge-pill">${tag.count}</span>
                    </a>
                `)}
            </ul>
        </div>
    `;
};

const renderAbout = ({sameAs, description}) => {
    return template`
        <section class="text-center">
            <div class="container">
                <p class="lead text-muted">${description}</p>
                <p class="contact-icon">
                    ${sameAs.map((href) => {
                        if (href.indexOf("github.com") >= 0) {
                            return `<a href="${href}" target="_blank"><i class="fab fa-github-square"></i></a>`;
                        } else if (href.indexOf("linkedin.com") >= 0) {
                            return `<a href="${href}" target="_blank"><i class="fab fa-linkedin"></i></a>`;
                        }
                    })}
                </p>
            </div>
        </section>
    `;
}

const renderBlogPost = ({headline, author, keywords, dateCreated, text}) => {
    const createdDate = new Date(dateCreated);
    return template`
        <div class="blog-summary">
            <h2 class="blog-post-title">${headline}</h2>
            <p class="blog-post-meta">${createdDate.toLocaleDateString()} ${author.name}</p>
            ${keywords && keywords.length > 0 ? keywords.map(word => `<span class="badge badge-secondary">${word}</span>`) : null}
            ${text}
        </div>
    `;
};

function getBlogListRenderer(head, tags, pageUrlFormatter) {
    return (props) => {
        return renderLayout({
            head: head,
            nav: renderNavBar({isAbout: false}),
            content: renderBlogCollection({
                tags: tags,
                blogs: renderBlogPage({...props, pageUrlFormatter: pageUrlFormatter})
            })
        });
    };
}

function getBlogPostRenderer(head) {
    return (props) => {
        return renderLayout({
            head: head,
            nav: renderNavBar({isAbout: false}),
            content: renderBlogPost(props)
        });
    };
}

function getAboutRenderer(head) {
    return (props) => {
        return renderLayout({
            head: head,
            nav: renderNavBar({isAbout: false}),
            content: renderAbout(props)
        });
    };
}

module.exports = {
    getBlogListRenderer: getBlogListRenderer,
    getBlogPostRenderer: getBlogPostRenderer,
    getAboutRenderer: getAboutRenderer,
    formatBlogPostUrl: formatBlogPostUrl,
    formatBlogListUrl: formatBlogListUrl,
    formatBlogListByTagUrl: formatBlogListByTagUrl,
    renderTags: renderTags
};