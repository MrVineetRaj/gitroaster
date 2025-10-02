/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom", // For React components
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    // Handle CSS imports (e.g., Tailwind)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Handle path aliases (map @/ to project root)
    "^@/(.*)$": "<rootDir>/$1", // ✅ FIXED
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // ✅ safer than "./"
};
