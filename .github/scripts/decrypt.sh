#!/bin/sh

# Firebase

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output android/app/google-services.json android/app/google-services.json.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output ios/vidramusic/GoogleService-Info.plist ios/vidramusic/GoogleService-Info.plist.gpg

# Signing Keys

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output android/app/release.keystore android/app/release.keystore.gpg

# gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
#   --output fastlane/AuthKey_6C5352C8R8.p8 fastlane/AuthKey_6C5352C8R8.p8.gpg

# gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
#   --output fastlane/bertie-434108-5fd4928195d9.json fastlane/bertie-434108-5fd4928195d9.json.gpg

# Env

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output .env .env.gpg
