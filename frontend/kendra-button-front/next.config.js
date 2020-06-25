module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId },
  ) {
    const paths = {
      '/': { page: '/index' },
      '/admin': { page: '/admin', query: { code: '', state: '' } },
    };
    return paths;
  },
  exportTrailingSlash: true,
};
