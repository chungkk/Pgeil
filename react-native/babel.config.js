module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Enable inline requires for lazy loading
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
  ],
  env: {
    production: {
      plugins: [
        // Remove console logs in production
        'transform-remove-console',
        // Enable RAM bundle inline requires
        'react-native-reanimated/plugin',
      ],
    },
  },
};
