const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");
const webpack = require("webpack");

module.exports = (env) => {
  if (env.dev) {
    dotenv.config({ path: ".env.dev" });
  } else if (env.prod) {
    dotenv.config({ path: ".env.prod" });
    console.log("prod");
  }

  const envValues = {
    RUN_ENV: JSON.stringify(process.env.RUN_ENV),
    RESTRICTED_MENU_ID_LIST: JSON.stringify(
      process.env.RESTRICTED_MENU_ID_LIST.split(",")
    ),
  };

  return {
    mode: "production",
    entry: {
      background: path.join(__dirname, "./src/background.ts"),
      index: path.join(__dirname, "./src/index.ts"),
      popup: path.join(__dirname, "./src/popup.ts"),
    },
    output: {
      path: path.join(__dirname, "./dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".ts", ".js", "..."],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "ts-loader",
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: ".", to: ".", context: "public" }],
      }),
      new webpack.DefinePlugin(envValues),
    ],
  };
};
