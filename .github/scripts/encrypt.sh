#!/bin/sh

# Signing Keys

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output android/app/release.keystore.gpg android/app/release.keystore

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output fastlane/AuthKey_MB44GW24AY.p8.gpg fastlane/AuthKey_MB44GW24AY.p8

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output fastlane/AuthKey_DJ9T2U84DJ.p8.gpg fastlane/AuthKey_DJ9T2U84DJ.p8

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output fastlane/bertie-74d8c-e01b7dfc401f.json.gpg fastlane/bertie-74d8c-e01b7dfc401f.json

# Env

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output .env.gpg .env
