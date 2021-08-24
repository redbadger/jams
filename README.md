Jams
========

Jams is a collaborative surey tool that gauges consensus around a series of sentences to which the participants can themselves contribute as well.
It is being built as a Red Badger bench project.

It can be currently found here: https://elated-austin-ae1db6.netlify.app/


## Getting started

This project is using the following tech and 3rd parties:

 - [Next.js](https://nextjs.org/) (bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app))
 - [yarn](https://yarnpkg.com/) for dependency management
 - [Chakra UI](https://chakra-ui.com/) as a component library
 - [Auth0](https://auth0.com/) as authentication provider
 - [Firebase Firestore](https://firebase.com/) as a data store
 - [Netlify](https://netlify.com/) for deployment
 - [Github Actions](https://github.com/redbadger/jams/actions) as CI/CD
 - [Jest](https://jestjs.io/) for testing
 - [Prettier](https://prettier.io/) for code formatting


## Running locally

1. You will need to have Node and Yarn installed.

1. The project expects a `.env.local` file with the following keys set:

    ```
    AUTH0_ISSUER_BASE_URL
    AUTH0_CLIENT_ID
    AUTH0_CLIENT_SECRET
    NEXTAUTH_URL
    FIREBASE_DB_URL
    ```

    It's probably better to ask one of the project maintainers for this.

1. To authenticate API requests with Firebase, you'll need a service account key on a `/secrets` folder. After [getting this file from Firebase](https://console.firebase.google.com/project/jams-dev/settings/serviceaccounts/adminsdk) run something like:

    ```bash
    mkdir secrets
    mv ~/Downloads/${downloaded_file.json} secrets/firebase_admin_credentials.json
    ```

1. Finally, run:

    ```bash
    yarn install
    yarn dev
    ```

The site will be running on [http://localhost:3000](http://localhost:3000).

