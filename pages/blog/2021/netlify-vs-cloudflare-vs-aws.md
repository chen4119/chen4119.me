---
"@type": BlogPosting
headline: Netlify vs Cloudflare pages vs AWS Amplify
description: Comparing TTFB performance and ease of use of deploying static website between Netlify, Cloudflare pages and AWS Amplify
author:
  "@id": /pages/about.yml
image:
  "@id": /data/images/aws-amplify-console.png?output=webp&thumbnails=600w,300w,200w
dateCreated: 2021-11-11
dateModified: 2021-11-11
keywords: 
  - netlify
  - cloudflare pages
  - aws amplify
---



I've been using [Netlify](https://www.netlify.com/) for a few years now to host my static website and really love how easy it was to get going.  Before Netlify, I hosted my static site on AWS S3 and that experience was painful.  You need to configure S3 for public and CORS access, add cloudfront, then set up a custom domain.  It's a lot of work just to deploy a static website so I'm very happy when I found Netlify.  I know [Cloudflare pages](https://pages.cloudflare.com/) and [AWS Amplify](https://aws.amazon.com/amplify/) also provide an easy way to host static websites and I finally had the chance to try them out.  Here are some thoughts.

## Ease of use

Both Netlify and Cloudflare made it really easy to get started and deploy a static website directly from your Github repo.  I'll say overall Netlify has a better user experience compare to Cloudflare because it's site is more intuitive and visually appealing whereas Cloudflare pages feel more barebone.  One major downside for Cloudflare is that there is no federated login.  You need to use an email and password to create a Cloudflare account whereas for Netlify, you can just use your Github credential.  In this day and age where we all have hundreds of online accounts, I'll prefer not to have another password for Cloudflare.

AWS Amplify also kept it really easy to deploy a static website but it's hard to say AWS Amplify is just as easy as Netlify and Cloudflare pages simply because AWS Amplify is a small feature within the AWS beast.  For those who are already familiar with AWS, Amplify will feel pretty simple but new users will be overwhelmed by so much options.  In terms of user experience, it definitely still lags Netlify and Cloudflare.  Instead of filling out a simple form, Amplify makes you edit the config blob below.  Not a big deal but it definitely feel more like a roadblock than a welcome sign.  

![AWS Amplify console screenshot](/data/images/aws-amplify-console.webp)

## Custom domain

Both Netlify and AWS Amplify allow you to easily set up custom domains with free ssl certificate.  It works with any third party DNS provider, you just need to set up an ALIAS record for it to work.

Cloudflare pages on the other hand will force you to use their DNS service in order to set up custom domain.  It won't work with third party DNS providers.  This might be a deal breaker for some people but at least Clouflare offers a free plan for their DNS service and it's really fast.

## Build time

I generated my website with [Sambal](https://sambal.dev) static site generator.  Below is a timing of how fast each platform took from the moment I commit to github to a deployed website.  AWS Amplify was the fastest while Cloudflare took the longest.  For some reason Cloudflare took close to 2 minutes just to initialize the build environment.  By that time, AWS Amplify had already deployed my website.

|                  | Build time |
|------------------|------------|
| AWS Amplify      | 1m 58s     |
| Netlify          | 2m 33s     |
| Cloudflare pages | 2m 53s     |

## TTFB test

To test how my static website perform across all regions around the world, I deployed the same website to all 3 platforms then use [SpeedVitals TTFB test](https://speedvitals.com/ttfb-test) to test the time to first byte across 25 different locations without using custom domain.  I hit each platform with their native URL.  Here is the average latency for the 3 platforms across different regions.

|                  | Americas | Europe | Asia  |
|------------------|----------|--------|-------|
| Cloudflare pages | 146ms    | 107ms  | 148ms |
| AWS Amplify      | 142ms    | 155ms  | 294ms |
| Netlify          | 186ms    | 67ms   | 271ms |

Overall Cloudflare seem to have consistently good latency across different regions.  I ran the test multiple times for each platform.  The first test is always the worst because the CDN hasn't cached anything yet.  Subsequent tests always show better latency.  The average latencies reported above are measured after 3 - 4 tries to get a more accurate picture.  I noticed with Cloudflare, it took just 2 tries to get consistently good results and it felt like once your page is cached, the traffic is always fast.  AWS Amplify is somewhere in the middle, while Netlify results can vary quite a lot on different tries.  Sometimes it's fast and sometimes it felt like there's a cache miss somewhere so it went back to your origin server.

To get a better picture, let's also look at the worst latency measured for the 3 platforms across different regions.

|                  | Americas | Europe | Asia   |
|------------------|----------|--------|--------|
| Cloudflare pages | 232ms    | 181ms  | 363ms  |
| AWS Amplify      | 187ms    | 184ms  | 407ms  |
| Netlify          | 744ms    | 140ms  | 1100ms |

From this table, it's more obvious that Netlify latency can be pretty bad at some locations although it seems to be consistently great in Europe.  Every platform has the worst latency in Asia.

## Summary

Netlify is a great platform for users who don't want to deal too much with technical stuff.  They just want to get their static website up and running.  It's easy to use and it offers pretty much anything you'll need to run a professional website.  Serverless backend, A/B testing, user authentication, forms, etc.  All these features with minimal coding.

Cloudflare is a great platform for developers who don't mind jumping through a few hoops to get the best performance.  Cloudflare DNS is one of the best DNS provider available and Cloudflare pages has consistently low latency across the globe.  The UX feels barebone and site navigation can be confusing but for the speed you get, I'm sure you can suck it up.

AWS Amplify is a great choice for existing AWS users or people who don't mind getting their hands dirty with AWS.  It has a fast build time and good latency across the globe.  It integrates with every other AWS offering so you don't have to worry about the limits of the platform as you might with Netlify or Cloudflare.  It has a steeper learning curve but the end result of being familiar with AWS is worth it.
