const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    // 设置代理
    // host: "0.0.0.0", //
    // port: 80, //自定义端口
    https: false, //false关闭https，true为开启
    open: false, //自动打开浏览器
    // proxy: {
    //   [process.env.VUE_APP_BASE_API]: {
    //     //同济医院地址
    //     target: process.env.VUE_APP_BASE_RUL,
    //     // 如果要代理 websockets
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       //重写路径，这种是没有我们定义的前缀
    //       ["^" + process.env.VUE_APP_BASE_API]: "",
    //     },
    //   },
    // },
    proxy: {
      "/risen-dyw-api": {
        target: "https://oaeb1.risencn.com:3323/risen-dyw-api",
        changeOrigin: true,
        pathRewrite: {
          "/risen-dyw-api": "",
        },
        onProxyReq(proxyReq) {
          const ipPost = Object.keys(proxyReq.agent.sockets)[0];
          const { path, protocol } = proxyReq;
          const host = ipPost.slice(0, -1).split(":::")[0];
          console.log(`${protocol}//${host}${path}`);
        },
      },
    },
  },
});
