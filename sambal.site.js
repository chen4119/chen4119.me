export const siteConfig = {
    baseUrl: "https://chen4119.me",
    collections: [
        {
            uri: "blog/latest",
            match: ["/blog/**/*"],
            sort: (a, b) => {
                return b.dateCreated.getTime() - a.dateCreated.getTime();
            }
        }
    ],
    theme: {
        name: "sambal-ui-material",
        options: {
            landingPage: false,
            googleAnalyticsId: "UA-12310823-5"
        }
    }
};
