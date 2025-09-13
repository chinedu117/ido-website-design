{
  "e2e": {
    "baseUrl": "http://localhost:3000",
    "supportFile": "cypress/support/e2e.ts",
    "specPattern": "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    "video": true,
    "screenshotOnRunFailure": true,
    "viewportWidth": 1280,
    "viewportHeight": 720,
    "defaultCommandTimeout": 10000,
    "requestTimeout": 10000,
    "responseTimeout": 10000
  },
  "component": {
    "devServer": {
      "framework": "next",
      "bundler": "webpack"
    },
    "specPattern": "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    "supportFile": "cypress/support/component.ts"
  }
}
