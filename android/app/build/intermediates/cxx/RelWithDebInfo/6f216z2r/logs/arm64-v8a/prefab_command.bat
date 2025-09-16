@echo off
"C:\\Program Files\\Java\\jdk-21\\bin\\java" ^
  --class-path ^
  "C:\\Users\\kotwa\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  arm64-v8a ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  27 ^
  --output ^
  "C:\\Users\\kotwa\\AppData\\Local\\Temp\\agp-prefab-staging17191693075379289075\\staged-cli-output" ^
  "C:\\Users\\kotwa\\.gradle\\caches\\8.14.3\\transforms\\19ebc5d0feddf2006ae4bd8bc7f6c8b4\\transformed\\react-android-0.81.4-release\\prefab" ^
  "C:\\Users\\kotwa\\OneDrive\\Desktop\\ONE-QLICK\\oneQlick-User-App\\android\\app\\build\\intermediates\\cxx\\refs\\react-native-reanimated\\1m6p584o" ^
  "C:\\Users\\kotwa\\OneDrive\\Desktop\\ONE-QLICK\\oneQlick-User-App\\android\\app\\build\\intermediates\\cxx\\refs\\react-native-worklets\\6z5thmi3" ^
  "C:\\Users\\kotwa\\.gradle\\caches\\8.14.3\\transforms\\d8d85eea07b70d0a756d35390e1aea37\\transformed\\hermes-android-0.81.4-release\\prefab" ^
  "C:\\Users\\kotwa\\.gradle\\caches\\8.14.3\\transforms\\1b1a3927c32b2f6141fd2ce3de18a57c\\transformed\\fbjni-0.7.0\\prefab"
