# Bertie

An app about books.

## Starting Guide

Here are a few steps to take in order to start developing.

### Installing dependencies

```sh
yarn
```

And then start the app with:

```sh
yarn start
```

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
