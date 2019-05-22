const path = require('path');
const { PHASE_PRODUCTION_SERVER } = require('next/constants');

module.exports = (phase) => {
  const common = {
    target: 'serverless',
  }

  if (phase === PHASE_PRODUCTION_SERVER) {
    return common;
  }

  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: !!JSON.parse(process.env.ANALYZE || 'false'),
  });

  return withBundleAnalyzer({
    ...common,
    webpack: (config, options) => {
      config.resolve.alias = Object.assign({}, config.resolve.alias || {}, {
        // Easy root level access to our file hierarcy.
        '~': path.join(options.dir),
      });

      return config;
    },
  });
};
