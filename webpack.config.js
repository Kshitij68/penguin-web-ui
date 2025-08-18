const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // For TypeScript files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.module\.scss$/, // For SCSS modules
        use: [
          "style-loader", // Injects CSS into the DOM
          {
            loader: "css-loader",
            options: {
              importLoaders: 1, // Ensures sass-loader is applied before css-loader
            },
          },
          "sass-loader", // Compiles SCSS to CSS
        ],
      },
      {
        test: /\.scss$/, // For global SCSS files (if any, excluding modules)
        exclude: /\.module\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
};
