# Test Documentation for MedChain IDO

## Overview
This document provides comprehensive testing documentation for the MedChain IDO wallet connection and smart contract integration features.

## Test Structure

### Unit Tests (`__tests__/`)
- **utils.test.ts**: Tests for utility functions (shortenAddress, isValidAddress, cn)
- **contracts.test.ts**: Tests for contract integration utilities
- **WalletContext.test.tsx**: Tests for wallet context functionality
- **WalletConnect.test.tsx**: Tests for wallet connection UI component

### End-to-End Tests (`cypress/e2e/`)
- **wallet-integration.cy.ts**: Complete user workflow testing

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- utils.test.ts
```

### End-to-End Tests
```bash
# Open Cypress Test Runner (interactive)
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run

# Run E2E tests with dev server
npm run test:e2e
```

### All Tests
```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Coverage

### Current Test Coverage Targets
- **Functions**: 80%
- **Lines**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Coverage Areas

#### ✅ Fully Covered
- Utility functions (shortenAddress, isValidAddress)
- Contract initialization
- Wallet connection/disconnection flow
- Balance fetching and display
- Error handling scenarios

#### 🔄 Partially Covered
- Complex transaction flows
- Network switching scenarios
- Event listener handling

#### ❌ Not Yet Covered
- Performance under load
- Memory leak scenarios
- Cross-browser compatibility edge cases

## Test Scenarios

### 1. Wallet Connection Tests

#### Unit Tests
```typescript
describe('WalletContext', () => {
  test('should connect wallet successfully')
  test('should handle MetaMask not installed')
  test('should handle wrong network')
  test('should handle connection error')
  test('should disconnect wallet')
})
```

#### E2E Tests
```typescript
describe('Wallet Connection Flow', () => {
  it('should display connect wallet button on initial load')
  it('should connect wallet successfully')
  it('should disconnect wallet')
})
```

### 2. Token Purchase Tests

#### Unit Tests
```typescript
describe('Purchase Flow', () => {
  test('should validate purchase amounts')
  test('should handle approval step')
  test('should complete purchase transaction')
  test('should handle insufficient funds')
})
```

#### E2E Tests
```typescript
describe('IDO Purchase Flow', () => {
  it('should validate purchase amount input')
  it('should calculate token amount correctly')
  it('should handle purchase transaction')
})
```

### 3. Balance Management Tests

#### Unit Tests
```typescript
describe('Balance Management', () => {
  test('should fetch balances after connection')
  test('should refresh balances manually')
  test('should handle balance fetch error')
})
```

#### E2E Tests
```typescript
describe('Balance Display', () => {
  it('should display wallet balances')
  it('should refresh balances after purchase')
})
```

## Mock Setup

### Jest Mocks
```typescript
// Ethers.js mock
jest.mock('ethers', () => ({
  ethers: {
    providers: { Web3Provider: jest.fn() },
    Contract: jest.fn(),
    utils: { isAddress: jest.fn(), formatEther: jest.fn() }
  }
}))

// Toast notifications mock
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn()
  }
}))
```

### Cypress Mocks
```typescript
// MetaMask provider mock
const mockEthereum = {
  isMetaMask: true,
  request: async (args) => {
    switch (args.method) {
      case 'eth_requestAccounts':
        return ['0x1234567890123456789012345678901234567890']
      case 'eth_chainId':
        return '0xaa36a7' // Sepolia
    }
  }
}
```

## Environment Setup

### Test Environment Variables
```env
NEXT_PUBLIC_IDO_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_MCH_CONTRACT_ADDRESS=0x2345678901234567890123456789012345678901
NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS=0x3456789012345678901234567890123456789012
NEXT_PUBLIC_NETWORK_ID=11155111
```

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'contexts/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}'
  ]
}
```

### Cypress Configuration
```typescript
// cypress.config.ts
export default {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true
  }
}
```

## Common Test Patterns

### 1. Component Testing Pattern
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks
  })

  test('should render correctly', () => {
    // Arrange
    // Act
    // Assert
  })

  test('should handle user interaction', () => {
    // Test user events
  })

  test('should handle error states', () => {
    // Test error scenarios
  })
})
```

### 2. Context Testing Pattern
```typescript
describe('ContextName', () => {
  const wrapper = ({ children }) => (
    <ContextProvider>{children}</ContextProvider>
  )

  test('should provide default values', () => {
    const { result } = renderHook(() => useContext(), { wrapper })
    expect(result.current).toEqual(expectedDefaults)
  })
})
```

### 3. E2E Testing Pattern
```typescript
describe('Feature Flow', () => {
  beforeEach(() => {
    cy.visit('/')
    // Setup test state
  })

  it('should complete happy path', () => {
    // Step 1: Initial state
    // Step 2: User action
    // Step 3: Verify result
  })
})
```

## Debugging Tests

### Jest Debugging
```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test with verbose output
npm test -- --verbose WalletContext.test.tsx
```

### Cypress Debugging
```bash
# Open Cypress with browser dev tools
npm run cypress:open

# Run with debug output
DEBUG=cypress:* npm run cypress:run
```

## Test Data Management

### Mock Data
```typescript
// Mock wallet addresses
const TEST_ADDRESSES = {
  WALLET_1: '0x1234567890123456789012345678901234567890',
  WALLET_2: '0x2345678901234567890123456789012345678901'
}

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: '0x1234',
    amount: '1000',
    status: 'completed',
    timestamp: '2025-01-09 14:30'
  }
]
```

### Test Fixtures
```typescript
// cypress/fixtures/wallet-data.json
{
  "connectedWallet": {
    "address": "0x1234567890123456789012345678901234567890",
    "ethBalance": "1.5",
    "tokenBalance": "1000"
  }
}
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

## Performance Testing

### Load Testing Considerations
- Test with multiple concurrent users
- Monitor memory usage during long sessions
- Test balance refresh performance
- Validate transaction processing under load

### Performance Metrics
- Initial page load: < 3 seconds
- Wallet connection: < 2 seconds
- Balance refresh: < 1 second
- Transaction confirmation: < 5 seconds

## Accessibility Testing

### Automated A11y Tests
```typescript
// Example with jest-axe
import { axe } from 'jest-axe'

test('should not have accessibility violations', async () => {
  const { container } = render(<WalletConnect />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Manual A11y Checklist
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] Color contrast compliance
- [ ] ARIA labels present

## Security Testing

### Security Test Cases
- Input validation for all form fields
- Protection against XSS attacks
- Secure handling of wallet addresses
- Validation of smart contract addresses
- Protection against CSRF attacks

## Maintenance

### Regular Test Maintenance Tasks
1. **Weekly**: Review failing tests
2. **Monthly**: Update test dependencies
3. **Quarterly**: Review test coverage reports
4. **Before releases**: Full test suite execution

### Test Documentation Updates
- Update when adding new features
- Revise when changing existing functionality
- Document new test patterns
- Keep coverage targets current

This comprehensive test documentation ensures the MedChain IDO platform maintains high quality and reliability through thorough testing practices.
