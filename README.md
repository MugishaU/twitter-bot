# twitter-bot

[![Production Deployment][circleci-badge]][production-deployment] [![Twitter URL][twitter-badge]][twitter-profile]

> :warning: Unfortunately, due to Twitter removing free access to its API, this project has been turned off. :warning:

This bot automates the [@BlackTechJobs][twitter-profile] Twitter page, with the aim of centralising resources for Black people to find opportunities in the tech world. It does this by retweeting tweets that meet specific criteria using the [Twitter API][twitter-api].

---

## Overview

This project's infrastructure is hosted on AWS, with continuous deployment configured with Github Actions. The application is split into two main AWS Lambda functions, the authorisation lambda and the twitter-bot lambda. The [authorisation lambda](#authorisation-lambda) is responsible for authorising the application with OAuth 2.0 to act on behalf of [@BlackTechJobs][twitter-profile]. The [twitter-bot lambda](#twitter-bot-lambda) is responsible for carrying out actions via the Twitter API after authorisation.

The motivation behind this project was to build a full backend system encapsulating application code, infrastructure as code, continuous deployment, security and testing whilst also hopefully providing value to others.

### Process

From 06:00 to 21:00 each day the system searches twitter for tweets every three hours that meet the criteria below and retweets them onto the page if they do. Before trying to access the Twitter API the app checks an internal database to see if it has a valid token, if it doesn't then it automatically generates a new one & saves it to the database. After collecting all the tweets that fit the criteria to be retweeted, it checks against an internal database for any tweets it has already retweeted. After retweeting it saves the tweets to the database, to be checked against next time.

[circleci-badge]: https://github.com/MugishaU/twitter-bot/actions/workflows/deploy.yml/badge.svg?branch=main
[production-deployment]: https://github.com/MugishaU/twitter-bot/actions/workflows/deploy.yml
[twitter-api]: https://developer.twitter.com/en/docs/twitter-api
[twitter-profile]: https://twitter.com/BlackTechJobs
[twitter-badge]: https://img.shields.io/twitter/url.svg?label=Follow%20%40BlackTechJobs&style=social&url=https%3A%2F%2Ftwitter.com%2FBlackTechJobs
[auth-app-code]: ./src/authorisation-lambda
[auth-infra-code]: ./terraform/modules/authorisation-lambda
[twitter-app-code]: ./src/twitter-bot-lambda
[twitter-infra-code]: ./terraform/modules/twitter-bot-lambda/
[pkce]: https://www.oauth.com/oauth2-servers/pkce/
[twitter-oauth]: https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code
