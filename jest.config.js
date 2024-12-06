module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Konverterar TypeScript-filer
    },
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy', // Hanterar CSS-importer i tester
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // Gör jest-dom tillgängligt i alla tester
  };
