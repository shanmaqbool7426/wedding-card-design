const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = [__dirname];

config.resolver.blockList = [
  new RegExp(`${path.resolve(__dirname, '.local').replace(/\\/g, '\\\\')}.*`),
  new RegExp(`${path.resolve(__dirname, 'server').replace(/\\/g, '\\\\')}.*`),
  new RegExp(`${path.resolve(__dirname, 'attached_assets').replace(/\\/g, '\\\\')}.*`),
];

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
