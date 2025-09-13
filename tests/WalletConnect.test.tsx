import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WalletConnect } from '@/components/WalletConnect'
import { useWallet } from '@/contexts/WalletContext'

// Mock the useWallet hook
jest.mock('@/contexts/WalletContext')
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>

// Mock the utils
jest.mock('@/lib/utils', () => ({
  shortenAddress: jest.fn((address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }),
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}))

describe('WalletConnect Component', () => {
  const mockConnectWallet = jest.fn()
  const mockDisconnectWallet = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Disconnected State', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        account: null,
        chainId: null,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: false,
        provider: null,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })
    })

    test('should render connect wallet button when disconnected', () => {
      render(<WalletConnect />)
      
      const connectButton = screen.getByRole('button', { name: /connect wallet/i })
      expect(connectButton).toBeInTheDocument()
    })

    test('should call connectWallet when connect button is clicked', async () => {
      render(<WalletConnect />)
      
      const connectButton = screen.getByRole('button', { name: /connect wallet/i })
      fireEvent.click(connectButton)

      expect(mockConnectWallet).toHaveBeenCalledTimes(1)
    })

    test('should have default variant for connect button', () => {
      render(<WalletConnect />)
      
      const connectButton = screen.getByRole('button', { name: /connect wallet/i })
      expect(connectButton).toHaveClass('bg-primary') // Assuming default button has this class
    })
  })

  describe('Connected State', () => {
    const mockAccount = '0x1234567890123456789012345678901234567890'

    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        account: mockAccount,
        chainId: 11155111,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: true,
        provider: {} as any,
        isCorrectNetwork: true,
        ethBalance: '1.5',
        nairaTokenBalance: '1000',
        mchBalance: '500',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })
    })

    test('should render shortened address when connected', () => {
      render(<WalletConnect />)
      
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
      expect(screen.queryByText(/connect wallet/i)).not.toBeInTheDocument()
    })

    test('should render disconnect button when connected', () => {
      render(<WalletConnect />)
      
      const disconnectButton = screen.getByRole('button')
      expect(disconnectButton).toBeInTheDocument()
      expect(disconnectButton).toHaveTextContent('0x1234...7890')
    })

    test('should call disconnectWallet when disconnect button is clicked', () => {
      render(<WalletConnect />)
      
      const disconnectButton = screen.getByRole('button')
      fireEvent.click(disconnectButton)

      expect(mockDisconnectWallet).toHaveBeenCalledTimes(1)
    })

    test('should have outline variant for disconnect button', () => {
      render(<WalletConnect />)
      
      const disconnectButton = screen.getByRole('button')
      expect(disconnectButton).toHaveClass('border') // Assuming outline variant has border class
    })

    test('should display power icon', () => {
      render(<WalletConnect />)
      
      expect(screen.getByText('⏻')).toBeInTheDocument()
    })
  })

  describe('Wrong Network State', () => {
    const mockAccount = '0x1234567890123456789012345678901234567890'

    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        account: mockAccount,
        chainId: 1, // Mainnet instead of Sepolia
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: true,
        provider: {} as any,
        isCorrectNetwork: false,
        ethBalance: '1.5',
        nairaTokenBalance: '1000',
        mchBalance: '500',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })
    })

    test('should show wrong network warning when on incorrect network', () => {
      render(<WalletConnect />)
      
      expect(screen.getByText('Wrong Network')).toBeInTheDocument()
    })

    test('should still show wallet address even on wrong network', () => {
      render(<WalletConnect />)
      
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    })

    test('should have red text color for wrong network warning', () => {
      render(<WalletConnect />)
      
      const warningText = screen.getByText('Wrong Network')
      expect(warningText).toHaveClass('text-red-500')
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty account gracefully', () => {
      mockUseWallet.mockReturnValue({
        account: '',
        chainId: null,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: false,
        provider: null,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      render(<WalletConnect />)
      
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument()
    })

    test('should handle null account gracefully', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        chainId: 11155111,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: false,
        provider: null,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      render(<WalletConnect />)
      
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument()
    })

    test('should handle very short account address', () => {
      mockUseWallet.mockReturnValue({
        account: '0x123',
        chainId: 11155111,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: true,
        provider: {} as any,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      render(<WalletConnect />)
      
      expect(screen.getByText('0x123...')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper button role and accessibility', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        chainId: null,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: false,
        provider: null,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      render(<WalletConnect />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    test('should maintain focus management for keyboard users', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        chainId: null,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: false,
        provider: null,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      render(<WalletConnect />)
      
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    test('should support keyboard interaction', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        chainId: null,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: false,
        provider: null,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      render(<WalletConnect />)
      
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      
      expect(mockConnectWallet).toHaveBeenCalledTimes(1)
    })
  })

  describe('Component Integration', () => {
    test('should properly integrate with wallet context state changes', async () => {
      const { rerender } = render(<WalletConnect />)

      // Initially disconnected
      mockUseWallet.mockReturnValue({
        account: null,
        chainId: null,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: false,
        provider: null,
        isCorrectNetwork: true,
        ethBalance: '0',
        nairaTokenBalance: '0',
        mchBalance: '0',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      expect(screen.getByText('Connect Wallet')).toBeInTheDocument()

      // Simulate connection
      mockUseWallet.mockReturnValue({
        account: '0x1234567890123456789012345678901234567890',
        chainId: 11155111,
        connectWallet: mockConnectWallet,
        disconnectWallet: mockDisconnectWallet,
        isConnected: true,
        provider: {} as any,
        isCorrectNetwork: true,
        ethBalance: '1.5',
        nairaTokenBalance: '1000',
        mchBalance: '500',
        refreshTokenBalances: jest.fn(),
        handleError: jest.fn(),
      })

      rerender(<WalletConnect />)

      await waitFor(() => {
        expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
        expect(screen.queryByText('Connect Wallet')).not.toBeInTheDocument()
      })
    })
  })
})
