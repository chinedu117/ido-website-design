import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { WalletProvider, useWallet } from '@/contexts/WalletContext'
import { toast } from 'sonner'
import { ethers } from 'ethers'

// Mock ethers
const mockProvider = {
  send: jest.fn(),
  getNetwork: jest.fn(),
  getBalance: jest.fn(),
  getSigner: jest.fn(() => ({
    getAddress: jest.fn(),
  })),
}

const mockContract = {
  balanceOf: jest.fn(),
  decimals: jest.fn(),
  approve: jest.fn(),
  buy: jest.fn(),
}

jest.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: jest.fn(() => mockProvider),
    },
    Contract: jest.fn(() => mockContract),
    utils: {
      formatEther: jest.fn((value) => '1.5'),
      formatUnits: jest.fn((value) => '1000'),
      parseEther: jest.fn(),
      parseUnits: jest.fn(),
    },
  },
}))

// Mock toast
jest.mock('sonner')
const mockToast = toast as jest.Mocked<typeof toast>

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true,
}

describe('WalletContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.window = Object.create(window)
    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: true,
    })
    
    // Setup default mock returns
    mockProvider.getNetwork.mockResolvedValue({ chainId: 11155111 })
    mockProvider.send.mockResolvedValue(['0x1234567890123456789012345678901234567890'])
    mockProvider.getBalance.mockResolvedValue(ethers.BigNumber?.from?.('1500000000000000000') || '1500000000000000000')
    mockContract.balanceOf.mockResolvedValue(ethers.BigNumber?.from?.('1000000000000000000000') || '1000000000000000000000')
    mockContract.decimals.mockResolvedValue(18)
  })

  describe('Initial State', () => {
    test('should initialize with default values', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      expect(result.current.account).toBe(null)
      expect(result.current.isConnected).toBe(false)
      expect(result.current.chainId).toBe(null)
      expect(result.current.provider).toBe(null)
      expect(result.current.ethBalance).toBe('0')
      expect(result.current.nairaTokenBalance).toBe('0')
      expect(result.current.isCorrectNetwork).toBe(false)
    })
  })

  describe('Wallet Connection', () => {
    test('should connect wallet successfully', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      expect(result.current.isConnected).toBe(true)
      expect(result.current.account).toBe('0x1234567890123456789012345678901234567890')
      expect(result.current.chainId).toBe(11155111)
      expect(result.current.isCorrectNetwork).toBe(true)
    })

    test('should handle MetaMask not installed', async () => {
      delete (window as any).ethereum

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      expect(mockToast.error).toHaveBeenCalledWith('Please install MetaMask to use this feature')
      expect(result.current.isConnected).toBe(false)
    })

    test('should handle wrong network', async () => {
      mockProvider.getNetwork.mockResolvedValue({ chainId: 1 }) // Mainnet instead of Sepolia

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      expect(result.current.isCorrectNetwork).toBe(false)
      expect(result.current.chainId).toBe(1)
    })

    test('should handle connection error', async () => {
      mockProvider.send.mockRejectedValue(new Error('User rejected request'))

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      expect(mockToast.error).toHaveBeenCalledWith('Failed to connect wallet')
      expect(result.current.isConnected).toBe(false)
    })
  })

  describe('Wallet Disconnection', () => {
    test('should disconnect wallet', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      // First connect
      await act(async () => {
        await result.current.connectWallet()
      })

      expect(result.current.isConnected).toBe(true)

      // Then disconnect
      act(() => {
        result.current.disconnectWallet()
      })

      expect(result.current.isConnected).toBe(false)
      expect(result.current.account).toBe(null)
      expect(result.current.chainId).toBe(null)
      expect(result.current.provider).toBe(null)
      expect(result.current.ethBalance).toBe('0')
      expect(result.current.nairaTokenBalance).toBe('0')
    })
  })

  describe('Balance Management', () => {
    test('should fetch balances after connection', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      await waitFor(() => {
        expect(result.current.ethBalance).toBe('1.5')
        expect(result.current.nairaTokenBalance).toBe('1000.00')
      })
    })

    test('should refresh balances manually', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      // Change mock return values
      mockContract.balanceOf.mockResolvedValue('2000000000000000000000')
      
      await act(async () => {
        await result.current.refreshTokenBalances()
      })

      await waitFor(() => {
        expect(result.current.nairaTokenBalance).toBe('1000.00') // formatUnits mock returns '1000'
      })
    })

    test('should handle balance fetch error', async () => {
      mockContract.balanceOf.mockRejectedValue(new Error('Network error'))

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch balances')
    })
  })

  describe('Event Listeners', () => {
    test('should handle account changes', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      // Simulate account change
      const accountChangedCallback = mockEthereum.on.mock.calls.find(
        call => call[0] === 'accountsChanged'
      )?.[1]

      if (accountChangedCallback) {
        await act(async () => {
          accountChangedCallback(['0x9999999999999999999999999999999999999999'])
        })

        expect(result.current.account).toBe('0x9999999999999999999999999999999999999999')
      }
    })

    test('should handle chain changes', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      // Mock window.location.reload
      const mockReload = jest.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      })

      // Simulate chain change
      const chainChangedCallback = mockEthereum.on.mock.calls.find(
        call => call[0] === 'chainChanged'
      )?.[1]

      if (chainChangedCallback) {
        act(() => {
          chainChangedCallback('0x1') // Mainnet
        })

        expect(result.current.chainId).toBe(1)
        expect(mockReload).toHaveBeenCalled()
      }
    })

    test('should disconnect when no accounts', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      expect(result.current.isConnected).toBe(true)

      // Simulate account disconnection
      const accountChangedCallback = mockEthereum.on.mock.calls.find(
        call => call[0] === 'accountsChanged'
      )?.[1]

      if (accountChangedCallback) {
        await act(async () => {
          accountChangedCallback([])
        })

        expect(result.current.isConnected).toBe(false)
      }
    })
  })

  describe('Error Handling', () => {
    test('should handle network switch error', async () => {
      mockProvider.getNetwork.mockResolvedValue({ chainId: 1 })
      mockEthereum.request.mockRejectedValue(new Error('User rejected'))

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      expect(mockToast.error).toHaveBeenCalledWith('Please switch to Sepolia network')
    })

    test('should handle missing token address', async () => {
      // Temporarily remove token address
      const originalAddress = process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS
      delete process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletProvider>{children}</WalletProvider>
      )

      const { result } = renderHook(() => useWallet(), { wrapper })

      await act(async () => {
        await result.current.connectWallet()
      })

      // Restore the address
      process.env.NEXT_PUBLIC_NAIRA_CONTRACT_ADDRESS = originalAddress

      // Balance should remain 0 since token address is missing
      expect(result.current.nairaTokenBalance).toBe('0')
    })
  })
})
