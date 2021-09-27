---
"@type": BlogPosting
headline: Sambal - a linked data static site generator
description: Using schema.org json-ld as a content model for an open way to build SEO websites
author:
  "@id": /pages/about.yml
image:
  "@id": /data/images/linked-data.jpg
dateCreated: 2021-07-09
dateModified: 2021-07-09
keywords: 
  - json-ld
  - schema.org
  - linked data
  - static site generator
  - sambal
---

[Sambal](https://sambal.dev) is a linked data static site generator that use [schema.org](https://schema.org/) [json-ld](https://json-ld.org/) as the content model.  This is in contrast to popular static site generators today that are content model agnostic.  It is up to the users to define their own content model.  While the flexibility might seem beneficial in the beginning, I think eventually people will start realizing the pain of dealing with incompatible data schemas for even the most mundane content.

Take the simple example of a blogpost.  It's been around for ages.  Everyone can agree that a blogpost contains an author, a timestamp, some tags, and the content of the post.  However, without a standard schema for a blogpost, you can encode a blogpost in various ways and that's not a good thing.  This incompatibility problem becomes more obvious when you salivate at these beautiful [blog themes](https://jekyllthemes.io/jekyll-blog-themes) for [Jekyll](https://jekyllrb.com/) but when you dig through the documentation, each one use a slightly different content model.  You facepalm and wonder if they deliberately did this to screw with you.

This is why Sambal is designed to natively support schema.org json-ld as the content model.  Imagine all the synergies gained when all parties converge on the same content model. 

1. Content creators can create their content in schema.org and not have to ask, "What data schema should I use?"
2. UI developers can create UI theme for schema.org types and not pigeonhole their theme to some self defined limited set of schema
3. Sambal can easily infer the content type of your webpage and automatically generate Facebook, Twitter, and ld+json metadata
4. The end result that everyone craves for is that search engine and AI agent/crawler can better understand your content and deliver it to your intended audience

Sounds like a win, win, win, win for everybody involved.  Schema.org is a great choice because it's open, has over 700+ content types and most importantly, it's supported by all the big search engines like Google and Microsoft.  

It's also fair to ask, then why write a completely new static site generator?  Why not just use schema.org content model with existing static site generators?  It's certainly possible and some people probably do already but existing static site generators do not fully leverage the power of linked data, which is what schema.org is.  Here's a simple example to illustrate what linked data is.  A simple schema.org blogpost markdown file might look like this

```md
---
"@type": BlogPosting
headline: My first blog post
author:
  "@type": Person
  name: John Smith
  email: john.smith@gmail.com
  sameAs:
    - https://www.linkedin.com/in/john-smith
publisher:
  "@type": Organization
  name: Blog Publisher
  address:
    "@type": PostalAddress
    streetAddress: 31 Main street
    addressLocality: Durham
    addressRegion: NC
---
My first blog post!
```

You can feed this into any static site generator to generate HTML but when you start having many blogposts, many written by the same author and others written by different author(s).  You can't really model this blogpost to author relationship with static json.  People usually do it with a database or CMS.  Using json-ld linked data however, you don't need this complexity.  Data fragments can live anywhere in the internet as long as it has a resolvable URL just like any webpage.  So the above blogpost markdown can be condensed into a simpler json-ld.

```md
---
"@type": BlogPosting
headline: My first blog post
author:
  "@id": https://author.com/johnsmith/schema.json
publisher:
  "@id": https://organization.com/blogpublisher
---
My first blog post!
```

Here the author and publisher data fragment is hosted in separate websites.  Sambal can recursively hydrate the above json-ld data by automatically resolving all @id URLs.  This is actually very similar to what's happening in a GraphQL server where you provide a function to resolve a value for a type or field in a schema.  For linked data, you are resolving a value for a URI.  A URI doesn't necessary need to be a https:// URL either but that is the most common protocol.  It can also be a AWS s3:// URL, ipfs:// URL, or pretty much any protocol.

By embracing open standards, Sambal looks to bring more compatiblity in publishing web content and avoid vendor lock in.  [Get started](https://www.sambal.dev/docs/get-started/) with Sambal to build your linked data [JAMstack](https://jamstack.org/) website.