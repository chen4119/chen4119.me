---
"@type": BlogPosting
headline: Json-ld spices up the staticness of static site generator
description: Discover how to join data fragments in markdown and yaml file without using database or CMS
author:
  "@id": /pages/about.yml
dateCreated: 2021-10-24
dateModified: 2021-10-24
keywords: 
  - json-ld
  - linked data
---

The best thing about static site generator is the simplicity.  All you need is a couple of markdown files, html templates, and the generator can spit out a speedy website with good old static HTML and CSS.  For a lot of websites, this is all you need and that's why static site generators are so popular.

As your website start getting bigger though, the limits of static site generator becomes more apparent.  The most glaring limitation is that there is just no easy way to relationalize or join data like you can easily do in a database.  To illustrate my point, consider a blogpost markdown

```markdown
---
title: My blogpost
date: 2021-10-17
author:
  name: John Smith
  twitter: @john
---

Content of the blog
```

The relationship between the author to blogpost is one to many.  John can write many blogposts but there is no easy way to normalize the one to many relationship in a static markdown file.  You can only duplicate john's info in every blogpost which is not ideal.  You might have noticed that the solution many blog themes took is to simply keep the author's info in the global config file.

[Here](https://github.com/yinkakun/gatsby-starter-glass/blob/master/gatsby-config.js) is an example for Gatsby, [here](https://github.com/dirkfabisch/mediator/blob/master/_config.yml) is an example for Jekyll, and [here](https://github.com/gethugothemes/liva-hugo/blob/master/exampleSite/config.toml) for Hugo.  Again, not ideal, but it'll work for a personal blog.  Once you have more than one author, the UI theme will need a major refactoring.

Of course you can always use a CMS to model your data and then pull those data into your static site generator to generate your webpage.  However, this adds another level of complexity and cost.  We'll explore how json-ld and the concept of linked data can help make static markdown/yaml files more dynamic.

# What is json-ld?

[Json-ld](https://json-ld.org/) is a linked data format based on json.  If you have never heard of json-ld, that's ok.  The most important thing to know is that it's just plain old json with a few extra special fields.  It's also a w3c standard and you can check out the [complete spec](https://www.w3.org/TR/json-ld11/).  We don't really need to understand the whole spec, we're just interested in the way json-ld can reference other data fragments with a url using the keyword "@id"

```yaml
title: My blogpost
date: 2021-10-17
author:
  "@id": https://example.com/author/johnsmith.yml     // @id is json-ld's way of referencing another data fragment
```

# Using json-ld over json

Since json-ld is just json, it means you can also use it in a markdown or yaml file.  Now all of a sudden, static markdown and yaml files that's so prevalent in static site generators are not so static anymore.  It can join with other data fragments without a database or CMS.  You just need a client side json-ld processor.

[Sambal](http://sambal.dev) is a static site generator that natively supports schema.org json-ld as the content model.  [Get started](https://www.sambal.dev/docs/get-started/) to discover the power of linked data.