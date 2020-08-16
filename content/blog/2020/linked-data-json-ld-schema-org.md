---
headline: Linked data, json-ld, and schema.org
description: Understand what these terms mean, how they are related to each other and how to leverage them to increase your SEO
author:
    "@id": _:content/about.yml
dateCreated: 2020-08-16
dateModified: 2020-08-16
keywords: ["json-ld", "schema.org"]
---

[Schema.org](https://schema.org/) structured data can be added to your website for better SEO and it's supported by all major search engines.  Google provided some [examples](https://developers.google.com/search/docs/guides/search-gallery) of how you can mark up your website with schema.org but there not much discussion about the idea of linked data or the benefits of json-ld.

Users might be left with the impression that schema.org is just another metadata they need to "add on" to their website in order to increase SEO.  There are many sample schema.org json-ld online that users can simply copy, change the values, paste it into their website and be done with it.  That certainly works but without understanding what linked data is, users might be leaving a lot of money on the table.  We'll take a step back and examine what is linked data and json-ld and how they relate to schema.org metadata.

# Linked data

To help understand linked data, it's worth asking how is it different from any other data (non-linked data?!) that you work with on a daily basis.  Excel, json, yaml, Wordpress, other any CMS data, etc.  Why do search engines need to be all fancy and shit and make you use schema.org?

The main difference is that linked data use a common schema that is understood by everybody whereas your data is most likely only understood by you and your organization.  Think about your Facebook, Twitter, and Linkedin profile.  They all describe the same thing, you, but unfortunately they are 3 different profiles each using their own schema.  As a consumer of the data, you have to look at the schema documentation for all 3 organizations to understand their data.  Put it another way, they are all talking about the same thing but using different vocabulary.  We all know how frustrating that can be when visiting a foreign country and trying to explain to a local in your own language.

What if you can somehow get all organizations to use the same vocabulary when publishing their data?  That's where linked data comes in.  The concept behind linked data is to use a globally unique identifier (URI) to describe every piece of data.  For example, let's all agree to use this schema to encode a person's name.

```js
{
    "https://schema.org/givenName": "John",
    "https://schema.org/lastName": "Smith"
}
```

Done!  You don't care if this data is from Facebook or Twitter or wherever as long as you use the same vocabulary.

# Json-ld

Json-ld is one format for encoding linked data.  There are others but we'll focus on json-ld simply because JSON data is everywhere.  Whether you're working with REST apis, CMS, static file generators, etc. your data is inevitably going to be JSON.  It doesn't hurt that Google also [recommends](https://developers.google.com/search/docs/guides/intro-structured-data#structured-data-format) json-ld as the preferred format to encode your schema.org metadata.

So what is json-ld? It stands for json linked data and it's actually just like any plain old json data that everybody is very familiar with but with two features that help enable linked data.  Technically, there's a lot more to json-ld than two features and you can check out the [W3C spec](https://www.w3.org/TR/json-ld/) for more info.

1. __@context__ - @context is a special field that user can provide to tell the json-ld processor how to expand each field into it's absolute URI.  

2. __@id__ - A globally unique URI for a json object which will allow other data to link to this data using this identifier

For example, here is a plain old proprietary JSON object that's probably not very useful for anyone other than the owner of this data.

```js
{
    "myFirstName": "John",
    "myLastName": "Smith"
}
```

BUT, sprinkle in some @context and @id magic

```js
{
    @context: {
        "myFirstName": "http://schema.org/givenName",
        "myLastName": "http://schema.org/familyName"
    },
    @id: "https://schema.link/person/john/smith",
    "myFirstName": "John",
    "myLastName": "Smith"
}
```

Now a proprietary data is suddenly standardized into schema.org vocabulary that everyone can understand.  Not only that, this piece of data has a globally unique id that anyone can refer to just like how every website has it's own unique URL.  


# schema.org

Schema.org is a set of commonly used schemas that a community published for everyone to use.  It's no different than the data schemas every system create for their own use.  The only difference is that schema.org is open and accessible to anyone who wants to use it.  The huge benefit being that if you use the same schema as everyone else then all data will be compatible with each other.  