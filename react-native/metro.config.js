const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Enable minification in production
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      compress: {
        // Remove console.log in production
        drop_console: !__DEV__,
      },
    },
  },
  serializer: {
    // Generate smaller bundles by removing unused code
    getModulesRunBeforeMainModule: () => [],
    
    // Optimize output
    processModuleFilter: (module) => {
      // Filter out unnecessary modules if needed
      return true;
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
