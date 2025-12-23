# Bertie

An app about books.

## Starting Guide

Here are a few steps to take in order to start developing.

### Installing dependencies

```sh
yarn
yarn pod-install # for iOS only
```

And then start the app with:

```sh
yarn start
```

> NOTE: you can run `yarn clean` to clean the build and dependencies

### Decrypyting secrets

In order to use the app you will need to decrypt the secrets that are used to access 3rd party services.

```sh
export SECRETS_PASSPHRASE=YOUR-PASSWORD
./.github/scripts/decrypt.sh
```

### Linting and Prettier

To run linting and check recommended code standards run:

```sh
yarn lint
```

### Deployment

Use fastlane to deploy the app to stores automatically.

#### Android

```sh
yarn distribute:android
```

Then go to [Google Play Console](https://play.google.com/console/u/0/developers/7669303631895810369/app/4973761525093240086/releases/overview) and make sure it's published to the Beta group or further to production if required.

#### iOS

```sh
yarn distribute:ios
```

Then go to [AppStore Connect](https://appstoreconnect.apple.com/teams/4fb753c2-1efd-4088-8a92-34f52e5c54da/apps/6738319713/testflight/groups/624bf819-59a9-440f-b066-d7203d011481/builds) Internal Testing Builds and complete the **Missing Compliance** step by selecting no encryption.

#### Web

##### Local Web Build Testing

To test the web build locally before deploying:

```sh
yarn build:web

npx serve web-build
```
