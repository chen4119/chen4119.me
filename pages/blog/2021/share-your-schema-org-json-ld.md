---
"@type": BlogPosting
headline: Share your schema.org json-ld using Sambal
description: Sambal generate your website in HTML and schema.org json-ld.  Now you can share your schema.org json-ld data just as easily as you share your webpage
author:
  "@id": /pages/about.yml
image:
  "@id": /data/images/share-schema.jpg
dateCreated: 2021-07-11
dateModified: 2021-07-11
keywords: 
  - json-ld
  - schema.org
  - linked data
  - sambal
  - web scraping
---

What's amazing about web content is how easy it is to share it with everyone.  You just share your URL and everybody can access it no matter where they are but many might not realize that this mostly only works for human.  The browser takes care of loading an URL and rendering HTML into a visual presentation we can easily consume.  This is not the case when you share web content with software applications.  Unlike humans, applications cannot easily consume content visually through rendered HTML.  That's why there are so many ways of [web scraping](https://en.wikipedia.org/wiki/Web_scraping) in order to extract content from a webpage.  The solutions are generally far from perfect and error prone.  But who cares.  Why would you want to share content with software applications?

There are actually many good reasons to make it easier for software applications to understand the content you published.  Businesses would like to make it easier for people to find their contact info.  Restaurants would like to make their menu more accessible.  E-commerce websites would like to put their products in front of more eyeballs.  These days, humans are not going to be the only source of traffic consuming your web content.  For better or worse, bots and web crawlers are also big consumers of web content.  If you consider that the vast majority of people rely on some kind of recommendation engine to find new content, it really start making you question whether you need to optimize your website for bots or humans?!

Unfortunately the vast majority of tools available for building a website today still focus mainly on publishing HTML and optimizing the visual experience (aka for humans).  The metadata and semantic markups for the website is generally an afterthought (aka for applications).

[Sambal](https://sambal.dev) publish your content in both HTML and [schema.org](https://schema.org/) [json-ld](https://json-ld.org/) so no matter a human or bot visit your website, they each can easily consume your content.  Sambal automatically adds the correct ld+json, Facebook, and Twitter metadata tags to your webpage and generates a separate schema.org json-ld file.

To see this in action, you can check out how to [get started](https://www.sambal.dev/docs/get-started) with Sambal or see the get started page in [schema.org json-ld format](https://www.sambal.dev/docs/get-started/schema.json).  Now you can share your schema.org json-ld data just as easily as you share your webpage.

