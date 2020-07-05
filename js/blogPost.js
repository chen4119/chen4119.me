const {template, render, pushJsonLd, loadJsonLd, loadContent, toSchemaOrgJsonLd} = require("sambal");
const {renderLayout, renderNavBar} = require("./layout");
const {of} = require("rxjs");


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
