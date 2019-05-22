module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(jsx?|tsx?)$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
      diagnostics: false,
    },
  },
};
