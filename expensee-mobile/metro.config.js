const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');

// Get the default config
const defaultConfig = getDefaultConfig(__dirname);

// Create base config with improved TypeScript support
const config = mergeConfig(defaultConfig, {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs', 'cjs'],
    extraNodeModules: {
      '@': require('path').resolve(__dirname, 'src'),
    },
  },
});

// Export with NativeWind configuration
module.exports = withNativeWind(config, {input: './global.css'});
