#!/bin/sh

# Encrypt the files
# --batch to prevent interactive command
# --yes to assume "yes" for questions

# Firebase

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
--output android/app/google-services.json.gpg android/app/google-services.json

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
--output ios/bertie/GoogleService-Info.plist.gpg ios/bertie/GoogleService-Info.plist

# Signing Keys

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
--output android/app/release.keystore.gpg android/app/release.keystore

# Env

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
--output .env.gpg .env
