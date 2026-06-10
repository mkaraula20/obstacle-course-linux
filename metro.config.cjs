// CommonJS (.cjs) because package.json sets "type": "module".
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;
