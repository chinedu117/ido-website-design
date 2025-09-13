// Custom commands for MetaMask and Web3 testing

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Connect to MetaMask wallet
       */
      connectWallet(): Chainable<void>
      
      /**
       * Switch to Sepolia network
       */
      switchToSepolia(): Chainable<void>
      
      /**
       * Get element by data-testid
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Wait for transaction to complete
       */
      waitForTransaction(): Chainable<void>
    }
  }
}

Cypress.Commands.add('connectWallet', () => {
  // Mock wallet connection
  cy.window().then((win) => {
    if (win.ethereum) {
      return win.ethereum.request({ method: 'eth_requestAccounts' })
    }
  })
})

Cypress.Commands.add('switchToSepolia', () => {
  // Mock network switching
  cy.window().then((win) => {
    if (win.ethereum) {
      return win.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }] // Sepolia
      })
    }
  })
})

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('waitForTransaction', () => {
  // Wait for transaction confirmation
  cy.wait(2000) // Simulate transaction time
})

export {}
