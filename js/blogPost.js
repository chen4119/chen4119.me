const {template, render, pushJsonLd, loadJsonLd, loadContent, toSchemaOrgJsonLd} = require("sambal");
const {renderLayout, renderNavBar} = require("./layout");
const {of} = require("rxjs");


const renderBlogPost = ({css, headline, author, keywords, dateCreated, text}) => {
    const classes = css.style({
        tags: {
            "padding-top": "3px",
            "padding-bottom": "1em"
        },
        blogMeta: {
            "margin-bottom": "0px"
        }
    });
    const createdDate = new Date(dateCreated);
    return template`
        <div class="blog-summary">
            <h2 class="blog-post-title">${headline}</h2>
            <p class="text-secondary ${classes.blogMeta}">
                ${createdDate.toLocaleDateString()}
            </p>
            <div class="${classes.tags}">
                ${keywords && keywords.length > 0 ? keywords.map(word => `<span class="badge badge-secondary">${word}</span>`) : null}
            </div>
            ${text}
        </div>
    `;
};

function getRenderer(head) {
    return (props) => {
        return renderLayout({
            css: props.css,
            head: head,
            nav: renderNavBar({isAbout: false}),
            content: renderBlogPost(props)
        });
    };
}

function page$(head) {
    return ({path, params}) => {
        return of(`content/blog/${params.year}/${params.file}.md`)
        .pipe(loadJsonLd({
            fetcher: (url) => loadContent(url)
        }))
        .pipe(pushJsonLd(d => toSchemaOrgJsonLd(d, "BlogPosting")))
        .pipe(render(getRenderer(head)));
    };
}

module.exports = {
    blogPost$: page$
};
