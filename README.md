# CheckOut App

> [!IMPORTANT]
> CheckOut is no longer actively maintained. To contribute to this repository, please fork it. This project is licensed under the MIT License.

This is the CheckOut App for iOS and Android, built with Expo.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## ⚠️ Security Notice

This app is primarily designed and intended for iOS and Android platforms. While web support exists, it is not recommended for production use due to security limitations:

- Web platform storage is limited to localStorage, which is less secure than native secure storage
- Authentication tokens and sensitive data may be exposed in browser storage
- Web authentication flows have different security characteristics than native flows

For secure usage, please develop on the iOS or Android versions of the app using Expo Go.
