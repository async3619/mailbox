import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: ["./src/**/*.ts"],
    coverageDirectory: "./coverage",
    testEnvironment: "jsdom",
    roots: ["<rootDir>"],
    modulePaths: ["."], // <-- This will be set to 'baseUrl' value
    coveragePathIgnorePatterns: ["<rootDir>/src/fixtures/", "<rootDir>/src/index.ts"],
};

module.exports = jestConfig;
