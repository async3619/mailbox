// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import "intersection-observer";
import fetch from "isomorphic-unfetch";

global.ResizeObserver = require("resize-observer-polyfill");
global.fetch = fetch;

jest.mock("next-i18next", () => ({
    useTranslation: () => {
        return {
            t: (id: string) => id,
        };
    },
}));
