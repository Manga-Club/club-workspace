# MangaClub

This repo does use NX so we righly recommend you to use [nx-console plugin](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) for vscode

## Basic setup steps

- Run `yarn` in the main repo to download all dependencies

# Common tools

### Prisma

Prisma is our ORM so all database changes should be done throught it (`prisma/schema.prisma` file)

#### Quick commands

- Prisma Studio `npx prisma studio`
- Run migrations, `npx prisma migrate`

# Projects

## SCRAPER-CRON

Here lies our cron functions that gets comics and chapters automatically from our sources,
it'll also save those resources in our S3 bucket that will be used for our other applications.

### How to build the code

- Before anything, you need to create a .env.environment (.env.dev, .env.staging, .env.prod)
- Run `serverless package`

### How to deploy

- Before anything, you need to copy your `.env` file from the root path, to the `scraper-cron` folder it should have the name .env.`environment` (.env.dev, .env.staging, .env.prod)
- Run `cd apps/scraper-cron`
- Setup you `AWS` [account](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)
- Run `aws sso login`
- Run `serverless deploy`

## public-wc

**Should we change this name later?**
Our public web client, made on [NextJS](https://nextjs.org/), it'll have all public and private routes of our web application

## public-api

**Should we change this name later?**
Our public api, made on [NestJS](https://nestjs.com)
