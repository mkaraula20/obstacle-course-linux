// CommonJS (.cjs) because package.json sets "type": "module"; Babel/Metro
// expect a CommonJS config here.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
