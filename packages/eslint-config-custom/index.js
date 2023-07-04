module.exports = {
    extends: ["next", "turbo", "plugin:prettier/recommended", "plugin:@typescript-eslint/recommended"],
    plugins: ["prettier"],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "@typescript-eslint/no-empty-interface": "off",
    },
    parserOptions: {
        babelOptions: {
            presets: [require.resolve("next/babel")],
        },
    },
};
