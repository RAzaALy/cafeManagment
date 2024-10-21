module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/controllers/**/*.js'], // Adjust this to your folder structure
  testPathIgnorePatterns: ['/node_modules/'],
};
