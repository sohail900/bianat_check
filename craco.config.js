const CracoLessPlugin = require("craco-less");
const CracoAlias = require("craco-alias");

module.exports = {
  mode: "development",
  stats: "errors-only",
  exclude: "/node_modules/",
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    // modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: "/.css$/",
        use: ["style-loader", "css-loader"],
      },
      {
        test: "/.scss$/",
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: "/.js$/" || "/.jsx$/",
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.js$/ || /\.jsx$/ || /\.ts$/ || /\.tsx$/,
        enforce: "pre",
        use: [
          {
            //needed to chain sourcemaps.  see: https://webpack.js.org/loaders/source-map-loader/
            loader: "source-map-loader",
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                //  console.log({ url, resourcePath }) example:
                // {
                //  url: 'index.js.map',
                //  resourcePath: '/repos/xlib-wsl/common/temp/node_modules/.pnpm/https-proxy-agent@5.0.0/node_modules/https-proxy-agent/dist/index.js'
                // }

                if (/.*\/node_modules\/.*/.test(resourcePath)) {
                  return false;
                }
                return true;
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#004f86",
              "@input-border-color": "#d9d9d9",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.paths.json",
      },
    }
  ],
};
