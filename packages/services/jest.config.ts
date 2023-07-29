import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: ["./src/**/*.ts", "!./src/**/*.spec.ts", "!./src/**/fixtures/**/*", "!./src/**/index.ts"],
    coverageDirectory: "./coverage",
    testEnvironment: "node",
    roots: ["<rootDir>"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    modulePaths: ["."], // <-- This will be set to 'baseUrl' value
    coveragePathIgnorePatterns: ["<rootDir>/src/fixtures/", "<rootDir>/src/index.ts"],
    passWithNoTests: true,
};

module.exports = jestConfig;
