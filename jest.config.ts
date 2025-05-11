import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: false,
  forceExit: true,
  detectOpenHandles: false,
  preset: 'ts-jest',
  testEnvironment: './jest/custom-environment.ts',
  globalTeardown: './jest/global-teardown.ts',
  setupFilesAfterEnv: [
    './jest/jestDefaultTimeout.ts',
    './jest/jestGlobalSetup.ts',
    './jest/jest-retry-setup.ts',
  ],
  roots: ['<rootDir>/test'],
  runner: 'groups',
  testRunner: 'jest-circus/runner',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.[t]s$': [
      'ts-jest',
      {
        isolatedModules: true,
        diagnostics: false,
        tsconfig: './tsconfig.json',
      },
    ],
  },
  collectCoverage: true,
  coverageReporters: ['text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      lines: 1,
    },
  },
  collectCoverageFrom: ['<rootDir>/src/**', '!**/*.test.ts'],
  coverageProvider: 'v8',
};

export default config;
