const {template, render, pushSchemaOrgJsonLd, toSchemaOrgJsonLd} = require("sambal");
const {renderLayout, renderNavBar} = require("./layout");
const {filter} = require("rxjs/operators");

const renderAboutPage = ({sameAs, description}) => {
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

function getAboutRenderer(head) {
    return (props) => {
        return renderLayout({
            css: props.css,
            head: head,
            nav: renderNavBar({isAbout: true}),
            content: renderAboutPage(props)
        });
    };
}

function renderAbout(content$, head) {
    return content$
    .pipe(filter(d => {
        return d.url === "https://chen4119.me/about";
    }))
    .pipe(pushSchemaOrgJsonLd(d => toSchemaOrgJsonLd(d, "Person")))
    .pipe(render(getAboutRenderer(head)));
}

module.exports = {
    renderAbout: renderAbout
};