#!/bin/sh

# Firebase

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output android/app/google-services.json.gpg android/app/google-services.json

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output ios/bertie/GoogleService-Info.plist.gpg ios/bertie/GoogleService-Info.plist

# Signing Keys

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output android/app/release.keystore.gpg android/app/release.keystore

# gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
#   --output fastlane/AuthKey_6C5352C8R8.p8.gpg fastlane/AuthKey_6C5352C8R8.p8

# gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
#   --output fastlane/bertie-434108-5fd4928195d9.json.gpg fastlane/bertie-434108-5fd4928195d9.json

# Env

gpg --quiet --batch --yes --symmetric --passphrase="$SECRETS_PASSPHRASE" \
  --output .env.gpg .env
