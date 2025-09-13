import { shortenAddress, isValidAddress, cn } from '@/lib/utils'

// Mock ethers utils
jest.mock('ethers', () => ({
  ethers: {
    utils: {
      isAddress: jest.fn(),
    },
  },
}))

import { ethers } from 'ethers'
const mockIsAddress = ethers.utils.isAddress as jest.MockedFunction<typeof ethers.utils.isAddress>

describe('Utils Functions', () => {
  describe('shortenAddress', () => {
    test('should shorten valid Ethereum address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const result = shortenAddress(address)
      expect(result).toBe('0x1234...7890')
    })

    test('should handle empty string', () => {
      const result = shortenAddress('')
      expect(result).toBe('')
    })

    test('should handle null input', () => {
      const result = shortenAddress(null as any)
      expect(result).toBe('')
    })

    test('should handle undefined input', () => {
      const result = shortenAddress(undefined as any)
      expect(result).toBe('')
    })

    test('should handle very short address', () => {
      const address = '0x123'
      const result = shortenAddress(address)
      expect(result).toBe('0x123...')
    })

    test('should handle address with exact length for slicing', () => {
      const address = '0x12345678'
      const result = shortenAddress(address)
      expect(result).toBe('0x1234...5678')
    })
  })

  describe('isValidAddress', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should return true for valid Ethereum address', () => {
      const validAddress = '0x1234567890123456789012345678901234567890'
      mockIsAddress.mockReturnValue(true)
      
      const result = isValidAddress(validAddress)
      
      expect(result).toBe(true)
      expect(mockIsAddress).toHaveBeenCalledWith(validAddress)
    })

    test('should return false for invalid address', () => {
      const invalidAddress = 'invalid-address'
      mockIsAddress.mockReturnValue(false)
      
      const result = isValidAddress(invalidAddress)
      
      expect(result).toBe(false)
      expect(mockIsAddress).toHaveBeenCalledWith(invalidAddress)
    })

    test('should return false when ethers throws error', () => {
      const invalidAddress = 'invalid'
      mockIsAddress.mockImplementation(() => {
        throw new Error('Invalid address')
      })
      
      const result = isValidAddress(invalidAddress)
      
      expect(result).toBe(false)
    })

    test('should handle empty string', () => {
      mockIsAddress.mockReturnValue(false)
      
      const result = isValidAddress('')
      
      expect(result).toBe(false)
    })

    test('should handle null input', () => {
      mockIsAddress.mockImplementation(() => {
        throw new Error('Invalid input')
      })
      
      const result = isValidAddress(null as any)
      
      expect(result).toBe(false)
    })
  })

  describe('cn (className utility)', () => {
    test('should combine classes correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(typeof result).toBe('string')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    test('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toContain('base-class')
      expect(result).toContain('conditional-class')
      expect(result).not.toContain('hidden-class')
    })

    test('should handle undefined and null values', () => {
      const result = cn('class1', null, undefined, 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    test('should merge conflicting Tailwind classes', () => {
      // This tests the twMerge functionality
      const result = cn('p-4', 'p-2')
      expect(result).toBe('p-2') // Later class should override
    })
  })
})
