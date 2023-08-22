// .eslintrc.js
module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["mobx"],
    extends: ["plugin:mobx/recommended", "next/core-web-vitals"],
    rules: {
        "mobx/missing-observer": "off",
    },
};
