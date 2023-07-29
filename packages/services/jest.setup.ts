// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import fetch from "isomorphic-unfetch";
import { JSDOM } from "jsdom";

global.fetch = fetch;
global.location = {} as Location;
global.DOMParser = new JSDOM().window.DOMParser;
(global as any).localStorage = {
    setItem: jest.fn(),
};
global.Node = new JSDOM().window.Node;
