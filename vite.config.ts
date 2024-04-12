import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default {
  plugins: [tsconfigPaths()],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[local]',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
