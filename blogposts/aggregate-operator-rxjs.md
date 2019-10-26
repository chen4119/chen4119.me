---
headline: Creating an aggregate operator in RxJs
description: How to implement a custom aggregate operator in RxJs
author:
    "@id": _:jsonld/me.yml
dateCreated: 2019-10-26
dateModified: 2019-10-26
keywords: ["rxjs", "javascript"]
id: aggregate-operator-rxjs
year: 2019
---

Below is an implementation of a custom aggregate operator in RxJs that can be pretty useful.  You specify which field in the data object you want to aggregate by and the operator will return you the count of every unique value of that field.  If the value of the field is an array, it will iterate through every item in the array.

```js
import {pipe, from, of} from "rxjs";
import {mergeMap, map, groupBy, reduce, toArray} from "rxjs/operators";

function aggregateBy(field) {
    return pipe(
        map((data) => data[field]),
        mergeMap(fieldValue => Array.isArray(fieldValue) ? from(fieldValue) : of(fieldValue)),
        groupBy(v => v),
        mergeMap(group$ =>
            group$.pipe(reduce((acc, cur) => {
                acc.count++;
                return acc;
            }, {key: group$.key, count: 0}))    
        ),
        toArray()
    );
}
```

One common use case might be if you want to count the number of blog posts an author has written or the number of times a tag has been used.  For example, saw you have an array of blog post metadata

```js
const metadatas = [{
    title: "First blog post",
    author: "author1",
    tags: ["action", "comedy"],
    year: 2019
},
{
    title: "Second blog post",
    author: "author1",
    tags: ["horror"],
    year: 2019
},
{
    title: "Third blog post",
    author: "author2",
    tags: ["comedy"],
    year: 2019
}];
```

You can aggregate by author

```js
from(metadatas)
.pipe(aggregateBy("author"))
.subscribe(d => console.log(d)); // [ { key: 'author1', count: 2 }, { key: 'author2', count: 1 } ]

```

You can also aggregate by tags

```js
from(metadatas)
.pipe(aggregateBy("tags"))
.subscribe(d => console.log(d));
/*
[ { key: 'action', count: 1 },
  { key: 'comedy', count: 2 },
  { key: 'horror', count: 1 } ]
*/
```


