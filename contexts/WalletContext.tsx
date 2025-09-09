import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

const TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS //MCH Token Address
// Add Token ABI interface for balance checking
const TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

interface WalletContextType {
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
  isCorrectNetwork: boolean;
  ethBalance: string;
  nairaTokenBalance: string;
  mchBalance: string;
  refreshBalances: () => Promise<void>;
  handleError: (error: any) => void;

}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [nairaTokenBalance, setNairaTokenBalance] = useState<string>('0');
  const [mchBalance, setMchBalance] = useState<string>('0');

  const EXPECTED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_NETWORK_ID);
  const NAIRA_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NAIRA_TOKEN_ADDRESS;

  const fetchBalances = async () => {
    if (!provider || !account || !NAIRA_TOKEN_ADDRESS) return;

    try {
      // Fetch ETH balance
      const ethBalanceWei = await provider.getBalance(account);
      const formattedEthBalance = ethers.utils.formatEther(ethBalanceWei);
      setEthBalance(parseFloat(formattedEthBalance).toFixed(4));

      // Fetch Token balance
      const nairaTokenContract = new ethers.Contract(NAIRA_TOKEN_ADDRESS, TOKEN_ABI, provider);
      const tokenBalanceWei = await nairaTokenContract.balanceOf(account);
      const decimals = await nairaTokenContract.decimals();
      const formattedTokenBalance = ethers.utils.formatUnits(tokenBalanceWei, decimals);
      setNairaTokenBalance(parseFloat(formattedTokenBalance).toFixed(2));

      const mchTokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS!,
        TOKEN_ABI,
        provider
      );

      const balance = await mchTokenContract.balanceOf(account);
      const formattedBalance = ethers.utils.formatEther(balance);
      setMchBalance(formattedBalance);

    } catch (error) {
      console.error('Error fetching balances:', error);
      toast.error('Failed to fetch balances');
    }
  };

  

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask to use this feature');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setAccount(accounts[0]);
      setChainId(network.chainId);

      // Fetch balances after connecting
      await fetchBalances();

      if (network.chainId !== EXPECTED_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}` }],
          });
        } catch (error) {
          toast.error('Please switch to Sepolia network');
        }
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Wallet connection error:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setEthBalance('0');
    setNairaTokenBalance('0');
    setMchBalance('0');
  };

  // Add refresh balances function
  const refreshBalances = async () => {
    await fetchBalances();
  };

  // Add to existing WalletContext
  const handleError = (error: any) => {
    if (error.code === 4001) {
      toast.error('Transaction rejected by user');
    } else if (error.code === -32603) {
      toast.error('Internal error. Please try again');
    } else {
      toast.error(error.message || 'Transaction failed');
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        await fetchBalances();
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16));
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Add effect to refresh balances periodically
  useEffect(() => {
    if (account) {
      const interval = setInterval(fetchBalances, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [account, provider]);

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        connectWallet,
        disconnectWallet,
        isConnected: !!account,
        provider,
        isCorrectNetwork: chainId === EXPECTED_CHAIN_ID,
        ethBalance,
        nairaTokenBalance,
        mchBalance,
        refreshBalances,
        handleError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
