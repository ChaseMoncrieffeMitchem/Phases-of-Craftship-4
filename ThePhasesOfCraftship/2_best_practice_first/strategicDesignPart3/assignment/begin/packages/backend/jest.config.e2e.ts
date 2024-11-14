// import * as path from 'path';
// import type { JestConfigWithTsJest } from 'ts-jest';
// import { pathsToModuleNameMapper } from 'ts-jest';

// import { compilerOptions } from '../../tsconfig.json';

// export default async (): Promise<JestConfigWithTsJest> => ({
//   displayName: 'Backend (E2E)',
//   testMatch: ['**/@(src|tests)/**/*.@(e2e).*'],
//   transform: {
//     '^.+\\.(t|j)sx?$': ['ts-jest', {}],
//   },
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
//     prefix: path.resolve(__dirname, '../../'),
//   }),
//   maxWorkers: 1,
//   globalSetup: './tests/support/globalDevEnvTestSetup.ts',
// });

const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest');

// Load compilerOptions from tsconfig.json using require
const compilerOptions = require('../../tsconfig.json').compilerOptions;

module.exports = async () => ({
  displayName: 'Backend (E2E)',
  testMatch: ['**/@(src|tests)/**/*.@(e2e).*'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {}],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: path.resolve(__dirname, '../../'),
  }),
  maxWorkers: 1,
  globalSetup: './tests/support/globalDevEnvTestSetup.ts',
});