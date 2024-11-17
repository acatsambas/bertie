#!/bin/sh

# Firebase

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output android/app/google-services.json android/app/google-services.json.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output ios/bertie/GoogleService-Info.plist ios/bertie/GoogleService-Info.plist.gpg

# Signing Keys

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output android/app/release.keystore android/app/release.keystore.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output fastlane/AuthKey_MB44GW24AY.p8 fastlane/AuthKey_MB44GW24AY.p8.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output fastlane/AuthKey_DJ9T2U84DJ.p8 fastlane/AuthKey_DJ9T2U84DJ.p8.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output fastlane/bertie-74d8c-e01b7dfc401f.json fastlane/bertie-74d8c-e01b7dfc401f.json.gpg

# Env

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
  --output .env .env.gpg
