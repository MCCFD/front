const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
  },
  pwa: {
    name: "mc-cfd",
    // themeColor: "#4DBA87",
    // msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    // configure the workbox plugin (GenerateSW or InjectManifest)
    // workboxPluginMode: "InjectManifest",
    // workboxOptions: {
    //   swSrc: "./src/service-worker.js",
    // },
  },
});
