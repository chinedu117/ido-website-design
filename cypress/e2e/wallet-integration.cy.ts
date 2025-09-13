describe('MedChain IDO E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Wallet Connection Flow', () => {
    it('should display connect wallet button on initial load', () => {
      cy.contains('Connect Wallet').should('be.visible')
    })

    it('should connect wallet successfully', () => {
      cy.contains('Connect Wallet').click()
      
      // Wait for connection
      cy.wait(1000)
      
      // Should show connected state
      cy.contains('0x1234...7890').should('be.visible')
    })

    it('should disconnect wallet', () => {
      // First connect
      cy.contains('Connect Wallet').click()
      cy.wait(1000)
      
      // Then disconnect
      cy.contains('0x1234...7890').click()
      
      // Should show disconnected state
      cy.contains('Connect Wallet').should('be.visible')
    })
  })

  describe('IDO Purchase Flow', () => {
    beforeEach(() => {
      // Connect wallet before each test
      cy.contains('Connect Wallet').click()
      cy.wait(1000)
    })

    it('should display IDO interface when wallet is connected', () => {
      cy.contains('Buy MCH Tokens').should('be.visible')
      cy.get('input[placeholder*="amount"]').should('be.visible')
    })

    it('should validate purchase amount input', () => {
      cy.get('input[placeholder*="amount"]').type('0')
      cy.contains('Purchase Tokens').should('be.disabled')
      
      cy.get('input[placeholder*="amount"]').clear().type('100')
      cy.contains('Purchase Tokens').should('not.be.disabled')
    })

    it('should calculate token amount correctly', () => {
      cy.get('input[placeholder*="amount"]').type('250')
      
      // Should show calculation (250 / 2.5 = 100 MCH)
      cy.contains('100 MCH').should('be.visible')
    })

    it('should handle purchase transaction', () => {
      cy.get('input[placeholder*="amount"]').type('1000')
      cy.contains('Purchase Tokens').click()
      
      // Should show loading state
      cy.contains('Processing purchase').should('be.visible')
      
      // Wait for transaction
      cy.wait(3000)
      
      // Should show success message
      cy.contains('Purchase successful').should('be.visible')
    })
  })

  describe('Balance Display', () => {
    beforeEach(() => {
      cy.contains('Connect Wallet').click()
      cy.wait(1000)
    })

    it('should display wallet balances', () => {
      cy.contains('ETH Balance').should('be.visible')
      cy.contains('MCH Balance').should('be.visible')
    })

    it('should refresh balances after purchase', () => {
      // Make a purchase
      cy.get('input[placeholder*="amount"]').type('500')
      cy.contains('Purchase Tokens').click()
      cy.wait(3000)
      
      // Balances should update
      cy.contains('MCH Balance').parent().should('contain', '200') // 500/2.5 = 200
    })
  })

  describe('Transaction History', () => {
    beforeEach(() => {
      cy.contains('Connect Wallet').click()
      cy.wait(1000)
    })

    it('should display transaction history tab', () => {
      cy.contains('Transaction History').click()
      cy.contains('Track all your MCH token purchases').should('be.visible')
    })

    it('should show transactions after purchase', () => {
      // First go to purchase tab
      cy.contains('Purchase Tokens').click()
      
      // Make a purchase
      cy.get('input[placeholder*="amount"]').type('750')
      cy.contains('Purchase Tokens').click()
      cy.wait(3000)
      
      // Go to transaction history
      cy.contains('Transaction History').click()
      
      // Should show the transaction
      cy.contains('₦750').should('be.visible')
      cy.contains('completed').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle no MetaMask error', () => {
      // Mock window without ethereum
      cy.window().then((win) => {
        delete win.ethereum
      })
      
      cy.contains('Connect Wallet').click()
      cy.contains('Please install MetaMask').should('be.visible')
    })

    it('should handle insufficient funds error', () => {
      cy.contains('Connect Wallet').click()
      cy.wait(1000)
      
      // Try to purchase more than balance
      cy.get('input[placeholder*="amount"]').type('999999999')
      cy.contains('Purchase Tokens').click()
      
      cy.contains('Insufficient funds').should('be.visible')
    })
  })

  describe('Network Validation', () => {
    it('should show wrong network warning', () => {
      // Mock wrong network
      cy.window().then((win) => {
        if (win.ethereum) {
          win.ethereum.request = async (args) => {
            if (args.method === 'eth_chainId') {
              return '0x1' // Mainnet instead of Sepolia
            }
            return null
          }
        }
      })
      
      cy.contains('Connect Wallet').click()
      cy.wait(1000)
      
      cy.contains('Wrong Network').should('be.visible')
    })
  })

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should display properly on mobile', () => {
      cy.contains('Connect Wallet').should('be.visible')
      cy.get('nav').should('be.visible')
    })

    it('should handle mobile wallet connection', () => {
      cy.contains('Connect Wallet').click()
      cy.wait(1000)
      cy.contains('0x1234...7890').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.get('body').tab()
      cy.focused().should('contain', 'Connect Wallet')
      
      cy.focused().type('{enter}')
      cy.wait(1000)
      
      cy.contains('0x1234...7890').should('be.visible')
    })

    it('should have proper ARIA labels', () => {
      cy.get('button[aria-label]').should('exist')
      cy.get('input[aria-label]').should('exist')
    })
  })
})
