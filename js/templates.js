const {template} = require("sambal-ssg");


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

const renderBlogPage = ({data, page, hasNext}) => {
    return template`
        ${data.map((blog => {
            const {headline, description, author, identifier} = blog.jsonld;
            return `
                <div class="blog-summary">
                    <a href="${identifier}.html">
                        <h2 class="blog-post-title">${headline}</h2>
                    </a>
                    <p class="blog-post-meta">Jan 1, 2014 by ${author.name}</p>
                    <p>${description}</p>
                    <hr>
                </div>
            `;
        }))}
        <nav class="blog-pagination">
            <a class="btn btn-outline-primary ${hasNext ? '' : 'disabled'}" href="${hasNext ? `page-${page + 1}.html` : '#'}">Older</a>
            <a class="btn btn-outline-primary ${page === 1 ? 'disabled' : ''}" href="${page === 1 ? '#' : `page-${page - 1}.html`}" tabindex="-1">Newer</a>
        </nav>
    `;
};

const renderNavBar = ({jsonld}) => {
    return template`
        <nav class="navbar navbar-expand-md navbar-light bg-light fixed-top">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item ${jsonld.type === 'Person' ? 'active' : ''}">
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
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${tag.key}
                        <span class="badge badge-primary badge-pill">${tag.count}</span>
                    </li>
                `)}
            </ul>
        </div>
    `;
};

const renderAbout = ({jsonld}) => {
    return template`
        <section class="text-center">
            <div class="container">
                <p class="lead text-muted">Javascript developer currently interested in linked data</p>
                <p class="contact-icon">
                    ${jsonld.sameAs.map((href) => {
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

const renderBlogPost = ({jsonld}) => {
    const {headline, author, text, keywords} = jsonld;
    return template`
        <div class="blog-summary">
            <h2 class="blog-post-title">${headline}</h2>
            <p class="blog-post-meta">Jan 1, 2014 by ${author.name}</p>
            ${keywords && keywords.length > 0 ? keywords.map(word => `<span class="badge badge-secondary">${word}</span>`) : ''}
            <p>${text}</p>
        </div>
    `;
};

module.exports = {
    renderLayout: renderLayout,
    renderBlogCollection: renderBlogCollection,
    renderTags: renderTags,
    renderBlogPage: renderBlogPage,
    renderAbout: renderAbout,
    renderBlogPost: renderBlogPost,
    renderNavBar: renderNavBar
};