const {template, render, pushJsonLd, loadJsonLd, toSchemaOrgJsonLd} = require("sambal");
const {renderLayout, renderNavBar} = require("./layout");
const {of} = require("rxjs");

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

function getRenderer(head) {
    return (props) => {
        return renderLayout({
            css: props.css,
            head: head,
            nav: renderNavBar({isAbout: true}),
            content: renderAbout(props)
        });
    };
}

function page$(head) {
    return ({path, params}) => {
        return of("content/about.yml")
        .pipe(loadJsonLd())
        .pipe(pushJsonLd(d => toSchemaOrgJsonLd(d, "Person")))
        .pipe(render(getRenderer(head)));
    };
}

module.exports = {
    aboutPage$: page$
};
