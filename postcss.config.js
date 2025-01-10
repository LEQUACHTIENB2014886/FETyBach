module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
        // 'last 2 versions', // The last 2 versions of all major browsers
      ],
      grid: true,
    },
  },
};
