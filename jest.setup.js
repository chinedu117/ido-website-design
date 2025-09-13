import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'
process.env.NEXT_PUBLIC_MCH_CONTRACT_ADDRESS = '0x2345678901234567890123456789012345678901'
process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS = '0x3456789012345678901234567890123456789012'
process.env.NEXT_PUBLIC_NETWORK_ID = '11155111'

// Extend expect with jest-dom matchers
import { expect } from '@jest/globals'

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true,
}

Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: mockEthereum,
})

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: jest.fn(() => ({
        send: jest.fn(),
        getNetwork: jest.fn(),
        getBalance: jest.fn(),
        getSigner: jest.fn(() => ({
          getAddress: jest.fn(),
        })),
      })),
    },
    Contract: jest.fn(() => ({
      balanceOf: jest.fn(),
      decimals: jest.fn(),
      approve: jest.fn(),
      buy: jest.fn(),
      estimateGas: {
        buy: jest.fn(),
        approve: jest.fn(),
      },
    })),
    utils: {
      isAddress: jest.fn(),
      formatEther: jest.fn(),
      formatUnits: jest.fn(),
      parseEther: jest.fn(),
      parseUnits: jest.fn(),
      hexlify: jest.fn(),
    },
    BigNumber: {
      from: jest.fn(),
    },
  },
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
