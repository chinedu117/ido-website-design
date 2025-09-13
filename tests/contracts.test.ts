import { getIDOContract, getNairaTokenContract } from '@/lib/contracts'
import { ethers } from 'ethers'

// Mock the ABI files
jest.mock('@/contracts/abi-MedChainIDO.json', () => ({
  abi: [
    {
      inputs: [],
      name: 'buy',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ],
}))

jest.mock('@/contracts/abi-NairaToken.json', () => ({
  abi: [
    {
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
}))

// Mock ethers Contract
const mockContract = {
  address: '',
  buy: jest.fn(),
  approve: jest.fn(),
  balanceOf: jest.fn(),
}

const mockSigner = {
  getAddress: jest.fn(),
}

const mockProvider = {
  getSigner: jest.fn(() => mockSigner),
  send: jest.fn(),
  getNetwork: jest.fn(),
  getBalance: jest.fn(),
} as unknown as ethers.providers.Web3Provider

jest.mock('ethers', () => ({
  ethers: {
    Contract: jest.fn(() => mockContract),
    providers: {
      Web3Provider: jest.fn(),
    },
  },
}))

const mockEthersContract = ethers.Contract as jest.MockedClass<typeof ethers.Contract>

describe('Contract Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment variables
    process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'
    process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS = '0x2345678901234567890123456789012345678901'
  })

  describe('getIDOContract', () => {
    test('should create IDO contract instance with valid parameters', () => {
      const contract = getIDOContract(mockProvider)

      expect(contract).toBeDefined()
      expect(mockEthersContract).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS,
        expect.any(Array), // ABI
        mockSigner
      )
      expect(mockProvider.getSigner).toHaveBeenCalled()
    })

    test('should throw error if IDO contract address not configured', () => {
      delete process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS

      expect(() => getIDOContract(mockProvider)).toThrow('IDO contract address not configured')
    })

    test('should throw error if IDO contract address is empty string', () => {
      process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS = ''

      expect(() => getIDOContract(mockProvider)).toThrow('IDO contract address not configured')
    })

    test('should handle provider with getSigner method', () => {
      const customMockProvider = {
        getSigner: jest.fn(() => mockSigner),
      } as unknown as ethers.providers.Web3Provider

      getIDOContract(customMockProvider)

      expect(customMockProvider.getSigner).toHaveBeenCalled()
    })
  })

  describe('getNairaTokenContract', () => {
    test('should create Naira token contract instance with valid parameters', () => {
      const contract = getNairaTokenContract(mockProvider)

      expect(contract).toBeDefined()
      expect(mockEthersContract).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS,
        expect.any(Array), // ABI
        mockSigner
      )
      expect(mockProvider.getSigner).toHaveBeenCalled()
    })

    test('should throw error if Naira contract address not configured', () => {
      delete process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS

      expect(() => getNairaTokenContract(mockProvider)).toThrow('Naira token contract address not configured')
    })

    test('should throw error if Naira contract address is empty string', () => {
      process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS = ''

      expect(() => getNairaTokenContract(mockProvider)).toThrow('Naira token contract address not configured')
    })

    test('should use correct ABI for Naira token contract', () => {
      getNairaTokenContract(mockProvider)

      expect(mockEthersContract).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS,
        expect.arrayContaining([
          expect.objectContaining({
            name: 'approve',
            type: 'function',
          }),
        ]),
        mockSigner
      )
    })
  })

  describe('Contract Integration', () => {
    test('should create both contracts with same provider', () => {
      const idoContract = getIDOContract(mockProvider)
      const nairaContract = getNairaTokenContract(mockProvider)

      expect(idoContract).toBeDefined()
      expect(nairaContract).toBeDefined()
      expect(mockProvider.getSigner).toHaveBeenCalledTimes(2)
    })

    test('should create contracts with different addresses', () => {
      getIDOContract(mockProvider)
      getNairaTokenContract(mockProvider)

      expect(mockEthersContract).toHaveBeenNthCalledWith(
        1,
        process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS,
        expect.any(Array),
        mockSigner
      )
      expect(mockEthersContract).toHaveBeenNthCalledWith(
        2,
        process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS,
        expect.any(Array),
        mockSigner
      )
    })
  })

  describe('Environment Variable Validation', () => {
    test('should handle undefined environment variables gracefully', () => {
      delete process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS
      delete process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS

      expect(() => getIDOContract(mockProvider)).toThrow()
      expect(() => getNairaTokenContract(mockProvider)).toThrow()
    })

    test('should work with environment variables set at runtime', () => {
      process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS = '0x9999999999999999999999999999999999999999'
      process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS = '0x8888888888888888888888888888888888888888'

      const idoContract = getIDOContract(mockProvider)
      const nairaContract = getNairaTokenContract(mockProvider)

      expect(idoContract).toBeDefined()
      expect(nairaContract).toBeDefined()
    })
  })
})
