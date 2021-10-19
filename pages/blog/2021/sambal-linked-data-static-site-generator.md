---
"@type": BlogPosting
headline: Sambal - a linked data static site generator
description: Generate SEO website directly from schema.org json-ld content 
author:
  "@id": /pages/about.yml
image:
  "@id": /data/images/linked-data.jpg
dateCreated: 2021-07-09
dateModified: 2021-10-04
keywords: 
  - json-ld
  - schema.org
  - linked data
  - static site generator
  - sambal
  - seo
---

[Sambal](https://sambal.dev) natively supports [schema.org](https://schema.org/) [json-ld](https://json-ld.org/) as the content model so you can render webpage directly from any schema.org json-ld data.  By using the open and well known schema.org vocabularies to structure your content from day one, it saves you the trouble of modeling your own content and later realizing it's not compatible with anyone else's content.

Take the simple example of a blogpost which contains an author, a timestamp, some tags, and the content of the post.  However, without standardizing on schema.org vocabularies, there are literally hundreds of ways you can encode a blogpost.  Tag can be category, title can be header, summary can be description, etc.  This inconsistency in data schema is a big problem that hasn't really been addressed.  It's the reason why it's so hard to switch from one theme to another or one static site generator to another when building a website.  Everybody uses their own flavor of content model even when the content is as simple as a blogpost.

Schema.org has over 700+ content types and most importantly, it's supported by all the big search engines like Google and Microsoft.  It's the ideal content model for the vast majority of websites.

It's also fair to ask, then why introduce a completely new static site generator?  You can use schema.org with existing static site generators too.  Yes, but existing static site generators do not fully leverage the power of linked data.  Schema.org json-ld can reference other pieces of data with a uri, similiar to how a hyperlink links to another webpage.  This allows you to do some pretty awesome things that plain old json/yaml data can't.  To illustrate what linked data can do, let's start with a simple markdown file for a blogpost that you commonly see.

```md
---
headline: My first blog post
author:
  name: Blue Devil
  email: blue.devil@email.com
publisher:
  name: Blog Publisher
  address:
    streetAddress: 125 Science Drive
    addressLocality: Durham
    addressRegion: NC
---
Content of my post
```

This blogpost contains some data about the author and publisher but once you start having multiple blogposts by the same author and publisher, you'll need to duplicate the data in every markdown file.  There is no standard way to normalize the data in static json/yaml like you can with a database.  In json-ld format though, you can!  Data fragments can be stored anywhere online as long as it has a resolvable URL.  You can simply reference the data using the special "@id" keyword like such

```md
---
headline: My first blog post
author:
  "@id": https://author.com/bluedevil
publisher:
  "@id": https://organization.com/blogpublisher
---
Content of my post
```

You can fetch author and publisher data directly from source and never worry about data becoming stale.  Sambal recursively hydrate json-ld data by automatically resolving all @id urls.  A url doesn't necessary need to be a https:// either.  It can be a AWS s3:// url, ipfs:// url, or pretty much any protocol.  Sambal provides an easy way to customize how to resolve any url.

[Get started](https://www.sambal.dev/docs/get-started/) with Sambal to build your SEO [JAMstack](https://jamstack.org/) website.
