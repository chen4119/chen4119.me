const {template} = require("sambal-ssg");



const renderNavigation = ({navigation}) => {
    return template`${navigation.map((navItem) => `<a class="page-link" href="${navItem.href}">${navItem.label}</a>`)}`;
};


const renderHeader = ({navigation}) => {
    return template`
        <header class="site-header">
            <div class="wrapper">
                <nav class="site-nav">
                    <div class="trigger">
                        ${navigation}
                    </div>
                </nav>
            </div>
        </header>
    `;
};

const renderLayout = ({head, header, content}) => {
    return template`
        <!DOCTYPE html>
        <html>
            <head>
                ${head}
            </head>
            <body>
                ${header}
                <div class="page-content">
                    <div class="wrapper">
                        ${content}
                    </div>
                </div>
            </body>
        </html>
    `;
};

const renderAbout = ({jsonld}) => {
    return template`
        <div class="post">
            <header class="post-header">
                <h1 class="post-title">${jsonld.givenName} ${jsonld.familyName}</h1>
            </header>
    
            <article class="post-content">
                ${jsonld.description}
                <span class="contacticon center">
                    ${jsonld.sameAs.map((href) => {
                        if (href.indexOf("github.com") >= 0) {
                            return `<a href="${href}" target="_blank"><i class="fa fa-github-square"></i></a>`;
                        } else if (href.indexOf("linkedin.com") >= 0) {
                            return `<a href="${href}" target="_blank"><i class="fa fa-linkedin-square"></i></a>`;
                        }
                    })}
                </span>
            </article>
        </div>    
    `;
}

const renderLanding = ({jsonld}) => {
    const publisher = jsonld.publisher;
    return template`
        <div class="header-bar">
            <h1>${publisher.givenName} ${publisher.familyName}</h1>
            <br/>
            <hr>
            <br/>
        </div>
    `;
}

module.exports = {
    renderNavigation: renderNavigation,
    renderLayout: renderLayout,
    renderHeader: renderHeader,
    renderLanding: renderLanding,
    renderAbout: renderAbout
};