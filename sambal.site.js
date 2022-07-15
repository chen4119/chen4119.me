export const siteConfig = {
    baseUrl: "https://chen4119.me",
    collections: [
        {
            uri: "/blog/latest",
            include: ["pages/blog/**/*"],
            sort: (a, b) => {
                return b.dateCreated.getTime() - a.dateCreated.getTime();
            }
        }
    ],
    imageTransforms: [
        {
            include: "data/images/**/*",
            encodingFormat: "image/webp",
            thumbnails: [
                {
                    suffix: "200",
                    width: 200
                },
                {
                    suffix: "300",
                    width: 300
                },
                {
                    suffix: "600",
                    width: 600
                }
            ]
        }
    ],
    theme: {
        name: "sambal-ui-material",
        options: {
            landingPage: false,
            googleAnalyticsId: "G-56FYBZP0PY"
        }
    }
};
