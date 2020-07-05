
const collections = [{
    name: "blogsByKeys",
    groupBy: "keywords",
    sortBy: [{field: "dateCreated", order: "desc"}]
}, {
    name: "latestBlogs",
    sortBy: [{field: "dateCreated", order: "desc"}]
}];

const BLOGS_PER_PAGE = 10;
const formatBlogListUrl = ({page}) => page === 1 ? "/" : `blog/page/${page}`;
const formatBlogListByTagUrl = ({groupBy, page}) => `/blog/tag/${encodeURIComponent(groupBy)}/${page}`;

module.exports = {
    collections: collections,
    BLOGS_PER_PAGE: BLOGS_PER_PAGE,
    formatBlogListUrl: formatBlogListUrl,
    formatBlogListByTagUrl: formatBlogListByTagUrl
};