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
        ${data.map((({headline, description, author, dateCreated, year, id}) => {
            // const createdDate = new Date(dateCreated);
            return `
                <div class="blog-summary">
                    <a href="${year}/${id}.html">
                        <h2 class="blog-post-title">${headline}</h2>
                    </a>
                    <p class="blog-post-meta">${dateCreated.toLocaleDateString()} by ${author.name}</p>
                    <p>${description}</p>
                    <hr>
                </div>
            `;
        }))}
        <nav class="blog-pagination">
            <a class="btn btn-outline-primary ${hasNext ? '' : 'disabled'}" href="${hasNext ? `pages/page-${page + 1}.html` : '#'}">Older</a>
            <a class="btn btn-outline-primary ${page === 1 ? 'disabled' : ''}" href="${page === 1 ? '#' : `pages/page-${page - 1}.html`}" tabindex="-1">Newer</a>
        </nav>
    `;
};

const renderNavBar = ({isAbout}) => {
    const homepage = "pages/page-1.html";
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
                    <a href="tags/${tag.key}/1.html" class="list-group-item d-flex justify-content-between align-items-center active">
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

const renderBlogPost = ({headline, author, keywords, language, text}) => {
    return template`
        <div class="blog-summary">
            <h2 class="blog-post-title">${headline}</h2>
            <p class="blog-post-meta">Jan 1, 2014 by ${author.name}</p>
            ${keywords && keywords.length > 0 ? keywords.map(word => `<span class="badge badge-secondary">${word}</span>`) : ''}
            <div class="language-${language}">
                <p>${text}</p>
            </div>
        </div>
    `;
};

function getBlogListRenderer(head, tags) {
    return (props) => {
        return renderLayout({
            head: head,
            nav: renderNavBar({isAbout: false}),
            content: renderBlogCollection({
                tags: tags,
                blogs: renderBlogPage(props)
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
    renderTags: renderTags
};