import { ConfigContext, ExpoConfig } from "expo/config";
export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins = [...(config.plugins || [])];
  const iosUrlScheme = process.env.GOOGLE_IOS_URL_SCHEME;
  // OAuth scheme is supplied when the company's iOS app is registered.
  if (iosUrlScheme)
    plugins.push([
      "@react-native-google-signin/google-signin",
      { iosUrlScheme },
    ]);
  return {
    ...config,
    name: "GreenGoldApp",
    slug: "greengoldapp",
    owner: "ordinos-team",
    plugins,
    ios: {
      ...config.ios,
      bundleIdentifier:
        process.env.IOS_BUNDLE_IDENTIFIER ||
        config.ios?.bundleIdentifier ||
        "org.foundationgreengold.greengoldapp",
    },
    android: {
      ...config.android,
      package:
        process.env.ANDROID_PACKAGE_NAME ||
        config.android?.package ||
        "org.foundationgreengold.greengoldapp",
    },
  };
};
