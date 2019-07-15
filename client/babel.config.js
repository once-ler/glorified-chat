module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", {
      "useBuiltIns": false
    }], 
    "@babel/preset-react", 
    "@babel/preset-flow"
  ];
  const plugins = [
    "@babel/plugin-proposal-class-properties", 
    "@babel/plugin-transform-flow-strip-types", 
    "@babel/plugin-transform-react-jsx",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-export-default-from"
  ];

  return {
    presets,
    plugins
  };
}