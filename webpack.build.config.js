var path = require("path");
var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin");
const mainStyle = new ExtractTextPlugin("main.css");
const commonStyle = new ExtractTextPlugin("common.css");
const customStyle = new ExtractTextPlugin("custom.css");

module.exports = {
	devtool: false,
	entry: {
		bundle: __dirname + "/src/resource.js",
		vendor: ["react", "react-dom", "redux", "react-redux"],
		common: [__dirname + "/public/js/index.js"],
		custom: [__dirname + "/public/js/main/login.js"],
	},
	output: {
		path: __dirname + "/public/build",
		filename: "[name].js",
		publicPath: "/public/build/",
		chunkFilename: "[name].[chunkhash:5].chunk.js",
	},
	resolve: {
		extensions: ["", ".js", ".jsx"],
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production"),
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false,
			},
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["vendor", "runtime"],
			filename: "[name].js",
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["common"],
			chunks: ["common"],
			filename: "[name].js",
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["custom"],
			chunks: ["custom"],
			filename: "[name].js",
		}),
		mainStyle,
		commonStyle,
		customStyle,
	],
	module: {
		loaders: [
			{
				test: /\.jsx{0,1}$/,
				loader:
					"babel-loader?" +
					JSON.stringify({ presets: ["react", "es2015", "stage-0"] }),
				exclude: /node_modules/,
				include: __dirname,
			},
			{ test: /\.(png|jpg|gif)$/, loader: "url?limit=819200" },
			{
				test: /\.css$/,
				loader: mainStyle.extract("style", "css!postcss"),
			},
			{
				test: /\.scss$/,
				loader: mainStyle.extract("style", "css!postcss!sass"),
			},
			{
				test: /\.css$/i,
				loader: commonStyle.extract("style", "css!postcss!sass"),
				include: __dirname + "/public/css/common/",
			},
			{
				test: /\.scss$/i,
				loader: commonStyle.extract("style", "css!postcss!sass"),
				include: __dirname + "/public/css/common/",
			},
			{
				test: /\.css$/i,
				loader: customStyle.extract("style", "css!postcss!sass"),
				include: __dirname + "/public/css/",
				exclude: __dirname + "/public/css/common/",
			},
			{
				test: /\.scss$/i,
				loader: customStyle.extract("style", "css!postcss!sass"),
				include: __dirname + "/public/css/",
				exclude: __dirname + "/public/css/common/",
			},
		],
	},
	postcss: [
		require("autoprefixer"), //调用autoprefixer插件,css3自动补全
	],
	babel: {
		plugins: [
			"transform-runtime",
			[
				"import",
				{
					libraryName: "antd",
					style: "css",
				},
			],
		],
	},
};
