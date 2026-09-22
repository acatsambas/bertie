#!/bin/sh

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output .env.gpg .env
