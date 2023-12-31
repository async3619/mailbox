import type { JestConfigWithTsJest } from "ts-jest";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const jestConfig: JestConfigWithTsJest = {
    preset: "ts-jest",
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: [
        "./src/**/*.(t|j)s",
        "!./src/main.ts",
        "!./src/migrations/*.ts",
        "!./src/**/*.module.ts",
        "!./src/**/*.(entity|model|dto|interface).ts",
    ],
    coverageDirectory: "./coverage",
    testEnvironment: "node",
    roots: ["<rootDir>"],
    modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
    testPathIgnorePatterns: ["<rootDir>/data-source/"],
};

export = jestConfig;
