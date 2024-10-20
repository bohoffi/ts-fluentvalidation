/* eslint-disable */
export default {
  displayName: 'core',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/core',
  collectCoverageFrom: ['src/lib/**/{!(version),}.ts', '!src/__tests__/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 80,
      statements: 100
    }
  }
};
