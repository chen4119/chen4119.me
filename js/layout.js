const {template} = require("sambal");


const renderNavBar = ({isAbout}) => {
    const homepage = "/";
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
                        <a class="nav-link" href="/about">About</a>
                    </li>
                </ul>
            </div>
        </nav>
    `;
}

const renderLayout = ({css, head, nav, content}) => {
    const classes = css.style({
        main: {
            "margin-top": "64px"
        }
    });
    return template`
        <!DOCTYPE html>
        <html>
            <head>
                ${head}
            </head>
            <body>
                ${nav}
                <main role="main" class="container ${classes.main}">
                    ${content}
                </main>
            </body>
        </html>
    `;
};

module.exports = {
    renderLayout: renderLayout,
    renderNavBar: renderNavBar
};