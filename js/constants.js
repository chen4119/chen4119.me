
const collections = [{
    name: "blogsByKeys",
    groupBy: "keywords",
    sortBy: [{field: "dateCreated", order: "desc"}]
}, {
    name: "latestBlogs",
    sortBy: [{field: "dateCreated", order: "desc"}]
}];

const HOST = "https://chen4119.me";
const BLOG_ROOT = "./content/blog";
const BLOGS_PER_PAGE = 10;
const formatBlogListUrl = ({page}) => page === 1 ? "/" : `blog/page/${page}`;
const formatBlogListByTagUrl = ({groupBy, page}) => `/blog/tag/${encodeURIComponent(groupBy)}/${page}`;

module.exports = {
    collections: collections,
    BLOG_ROOT: BLOG_ROOT,
    BLOGS_PER_PAGE: BLOGS_PER_PAGE,
    HOST: HOST,
    formatBlogListUrl: formatBlogListUrl,
    formatBlogListByTagUrl: formatBlogListByTagUrl
};