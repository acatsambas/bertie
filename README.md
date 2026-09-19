# Bertie

An app about books.

## Starting Guide

### Installing dependencies

```sh
yarn
```

Then start the app with:

```sh
yarn web
```

### Decrypting secrets

In order to use the app you will need to decrypt the secrets that are used to access 3rd party services.

```sh
export SECRETS_PASSPHRASE=YOUR-PASSWORD
./.github/scripts/decrypt.sh
```

### Linting and Prettier

```sh
yarn lint
```

### Deployment

The web app is deployed via Vercel (`yarn build:web`).

#### Local Web Build Testing

```sh
yarn build:web

npx serve dist
```
