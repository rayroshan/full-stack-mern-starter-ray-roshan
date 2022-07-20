const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  eslint: { ignoreDuringBuilds: true },
  env: {
    BASE_URL: 'http://localhost:5555',
  }
}

