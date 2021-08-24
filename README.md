Jams
========

Jams is a collaborative surey tool that gauges consensus around a series of sentences to which the participants can themselves contribute as well.
It is being built as a Red Badger bench project.


## Getting started

This project is using the following tech and 3rd parties:

 - [Next.js](https://nextjs.org/) (bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app))
 - [yarn](https://yarnpkg.com/) for dependency management
 - [Chakra UI](https://chakra-ui.com/) as a component library
 - [Auth0](https://auth0.com/) as authentication provider
 - [Firebase Firestore](https://firebase.com/) as a data store
 - [Netlify](https://netlify.com/) for deployment
 - [Github Actions](https://github.com/redbadger/jams/actions) as CI/CD


## Running locally

You need Node, Yarn and a `.env` file with the following keys set:

```
AUTH0_SECRET
AUTH0_BASE_URL
AUTH0_ISSUER_BASE_URL
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
NEXTAUTH_URL
FIREBASE_DB_URL
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_SENDER_ID
FIREBASE_APP_ID
```

It's probably better to ask one of the project maintainers for this.

Next, run:

```bash
yarn install
yarn dev
```

The site will be running on [http://localhost:3000](http://localhost:3000).

