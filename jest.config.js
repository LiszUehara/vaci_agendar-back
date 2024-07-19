export default {
  testEnvironment: "jsdom",
  transform: {
        "^.+\\.ts?$": "ts-jest"
  },
  globals: {
      "TextEncoder": "TextEncoder",
      "TextDecoder": "TextDecoder"
  },
  moduleFileExtensions: [
      "js",
      "ts"
  ]
};