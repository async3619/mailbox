import nextJest from "next/jest.js";
import type { Config } from "@jest/types";

const createJestConfig = nextJest();

// Add any custom config to be passed to Jest
const config: Config.InitialOptions = {
    // Add more setup options before each test is run
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jest-environment-jsdom",
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts", "!src/**/index.{ts,tsx}"],
    coveragePathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
