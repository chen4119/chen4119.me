const {template, render, pushSchemaOrgJsonLd, toSchemaOrgJsonLd} = require("sambal");
const {renderLayout, renderNavBar} = require("./layout");
const {filter} = require("rxjs/operators");


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


function getBlogPostRenderer(head) {
    return (props) => {
        return renderLayout({
            css: props.css,
            head: head,
            nav: renderNavBar({isAbout: false}),
            content: renderBlogPost(props)
        });
    };
}

function renderBlogPosts(content$, head) {
    return content$
    .pipe(filter(d => {
        return d.url !== "https://chen4119.me/about";
    }))
    .pipe(pushSchemaOrgJsonLd(d => toSchemaOrgJsonLd(d, "BlogPosting")))
    .pipe(render(getBlogPostRenderer(head)));
}

module.exports = {
    renderBlogPosts: renderBlogPosts
};