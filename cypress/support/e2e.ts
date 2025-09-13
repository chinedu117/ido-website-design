// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// MetaMask setup for testing
Cypress.on('window:before:load', (win) => {
  // Mock ethereum provider for testing
  const mockEthereum = {
    isMetaMask: true,
    request: async (args: any) => {
      switch (args.method) {
        case 'eth_requestAccounts':
          return ['0x1234567890123456789012345678901234567890']
        case 'eth_chainId':
          return '0xaa36a7' // Sepolia chain ID
        case 'wallet_switchEthereumChain':
          return null
        case 'eth_getBalance':
          return '0x1bc16d674ec80000' // 2 ETH in wei
        default:
          return null
      }
    },
    on: (event: string, handler: Function) => {
      // Mock event listeners
    },
    removeListener: (event: string, handler: Function) => {
      // Mock event listener removal
    }
  }

  // Add the mock ethereum provider to the window
  win.ethereum = mockEthereum
})
