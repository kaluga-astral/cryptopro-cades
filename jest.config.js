module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['node_modules', 'lib'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
};
