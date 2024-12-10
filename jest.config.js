module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Konverterar TypeScript-filer
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transformIgnorePatterns: ['node_modules/(?!your-module-to-transform)'],
  };
