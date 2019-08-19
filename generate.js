const {of, defer, forkJoin} = require("rxjs");
const {map} = require("rxjs/operators");
const fs = require("fs");
const {fromSchemaOrg, template, layout, render, Packager} = require("sambal-ssg");
const {renderNavigation, renderLayout, renderHeader, renderLanding, renderAbout} = require("./js/templates");
/*
const multi = from([1, 2, 3]).pipe(multicast(() => new Subject())) as ConnectableObservable<any>;

multi.pipe(map((d) => `one-${d}`)).subscribe((d) => console.log(d));
multi.pipe(map((d) => `two-${d}`)).subscribe((d) => console.log(d));

multi.connect();
*/

function readFile(src) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

const navigation = [
    {href: "about.html", label: "About"}
];


const packager = new Packager("./public");
packager
.clean();

// const nav = defer(() => renderNavigation({navigation: navigation}));

/*
forkJoin({
    jsonld: fromSchemaOrg("jsonld/site.yml"),
    navigation: renderNavigation({navigation: navigation})
})
.subscribe(d => console.log(d));*/


fromSchemaOrg("jsonld/site.yml")
.pipe(layout({
    head: readFile("fragments/head.html"),
    header: renderHeader({navigation: renderNavigation({navigation: navigation})}),
    content: renderLanding
}))
.pipe(render(renderLayout))
.subscribe(async (d) => {
    await packager.route(":url", d);
});

fromSchemaOrg("jsonld/me.yml")
.pipe(layout({
    head: readFile("fragments/head.html"),
    header: renderHeader({navigation: renderNavigation({navigation: navigation})}),
    content: renderAbout
}))
.pipe(render(renderLayout))
.subscribe(async (d) => {
    await packager.route(":url", d);
});


