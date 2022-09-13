# twitter-bot

[![Production Deployment][circleci-badge]][production-deployment] [![Twitter URL][twitter-badge]][twitter-profile]

---

This bot automates the [@BlackTechJobs][twitter-profile] Twitter page, with the aim of centralising resources for Black people to find opportunities in the tech world. It does this by retweeting tweets that meet specific criteria using the [Twitter API][twitter-api].

---

## Overview

- language
- infra
- deployment
- Testing

## Architecture

- Overview
- Authentication Lambda
  - diagram
  - link
- Tweet Lambda
  - diagram
  - link

## Infrastructure

- Terraform
- Remote State

## Deployment

- Scripts
  - Obfuscating details, packaging app
- Github Actions Pipeline

## Testing

- Coverage, mocking, minimums

## Future Improvements

- tweets

[circleci-badge]: https://github.com/MugishaU/twitter-bot/actions/workflows/deploy.yml/badge.svg?branch=main
[production-deployment]: https://github.com/MugishaU/twitter-bot/actions/workflows/deploy.yml
[twitter-api]: https://developer.twitter.com/en/docs/twitter-api
[twitter-profile]: https://twitter.com/BlackTechJobs
[twitter-badge]: https://img.shields.io/twitter/url.svg?label=Follow%20%40BlackTechJobs&style=social&url=https%3A%2F%2Ftwitter.com%2FBlackTechJobs
