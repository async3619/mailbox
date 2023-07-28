import nextJest from "next/jest.js";
import { Config } from "jest";

const createJestConfig = nextJest({
    dir: "./",
});

const config: Config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "json"],
    testEnvironment: "jest-environment-jsdom",
    testMatch: [
        "**/components/**/?(*.)+(spec|test).+(ts|tsx|js)",
        "**/services/**/?(*.)+(spec|test).+(ts|tsx|js)",
        "**/utils/**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/components/**/*.{js,jsx,ts,tsx}",
        "src/services/**/*.{js,jsx,ts,tsx}",
        "src/utils/**/*.{js,jsx,ts,tsx}",
        "!**/*.styles.{tsx,ts}",
    ],
    transformIgnorePatterns: ["node_modules/(?!(react-merge-refs)/)"],
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
};

module.exports = async () => ({
    /**
     * Using ...(await createJestConfig(customJestConfig)()) to override transformIgnorePatterns
     * provided byt next/jest.
     *
     * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096635363
     */
    ...(await createJestConfig(config)()),
    /**
     * Swiper uses ECMAScript Modules (ESM) and Jest provides some experimental support for it
     * but "node_modules" are not transpiled by next/jest yet.
     *
     * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096698456
     * @link https://jestjs.io/docs/ecmascript-modules
     */
    transformIgnorePatterns: ["node_modules/(?!(swiper|ssr-window|dom7)/)"],
    testEnvironment: "jest-environment-jsdom",
});
