echo "🧹 Cleaning..."

# Node
rm -rf node_modules

# iOS
rm -rf ios/Pods
rm -rf ios/build
rm -rf .local_derived_data
rm -rf Bertie.ipa
rm -rf Bertie.app.dSYM.zip

# Android
rm -rf android/build
rm -rf android/app/build
rm -rf android/.gradle
rm -rf android/.idea
rm -rf android/captures
