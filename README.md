# twitter-bot

[![Production Deployment][circleci-badge]][production-deployment] [![Twitter URL][twitter-badge]][twitter-profile]

---

This bot automates the [@BlackTechJobs][twitter-profile] Twitter page, with the aim of centralising resources for Black people to find opportunities in the tech world. It does this by retweeting tweets that meet specific criteria using the [Twitter API][twitter-api].

---

## Overview

This project's infrastructure is hosted on AWS, with continuous deployment configured with Github Actions. The application is split into two main AWS Lambda functions, the authorisation lambda and the twitter-bot lambda. The [authorisation lambda](#authorisation-lambda) is responsible for authorising the application with OAuth 2.0 to act on behalf of [@BlackTechJobs][twitter-profile]. The [twitter-bot lambda](#twitter-bot-lambda) is responsible for carrying out actions via the Twitter API after authorisation.

The motivation behind this project was to build a full backend system encapsulating application code, infrastructure as code, continuous deployment, security and testing whilst also hopefully providing value to others.

---

## Architecture

### Authorisation Lambda

- diagram
- link
  auth flow (manual initial, refresh token, scopes)

### Twitter-bot Lambda

- diagram
- link

---

## Infrastructure

- Terraform
- Remote State

---

## Deployment

- Scripts
  - Obfuscating details, packaging app
- Github Actions Pipeline

---

## Testing

- Coverage, mocking, minimums

---

## Future Improvements

- tweets

[circleci-badge]: https://github.com/MugishaU/twitter-bot/actions/workflows/deploy.yml/badge.svg?branch=main
[production-deployment]: https://github.com/MugishaU/twitter-bot/actions/workflows/deploy.yml
[twitter-api]: https://developer.twitter.com/en/docs/twitter-api
[twitter-profile]: https://twitter.com/BlackTechJobs
[twitter-badge]: https://img.shields.io/twitter/url.svg?label=Follow%20%40BlackTechJobs&style=social&url=https%3A%2F%2Ftwitter.com%2FBlackTechJobs
