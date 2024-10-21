#!/bin/sh

# Decrypt the file
# --batch to prevent interactive command
# --yes to assume "yes" for questions

# Firebase

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output android/app/google-services.json android/app/google-services.json.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output ios/vidramusic/GoogleService-Info.plist ios/vidramusic/GoogleService-Info.plist.gpg

# Signing Keys

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output android/app/release.keystore android/app/release.keystore.gpg

# Env

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output .env .env.gpg
