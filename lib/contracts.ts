import { ethers } from 'ethers';
import IDO_ABI from '@/contracts/abi-MedChainIDO.json';
import NAIRA_TOKEN_ABI from '@/contracts/abi-NairaToken.json';

export const IDO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS;
export const NAIRA_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NAIRA_TOKEN_ADDRESS;

export const getIDOContract = (provider: ethers.providers.Web3Provider) => {
  if (!IDO_CONTRACT_ADDRESS) {
    throw new Error('IDO contract address not configured');
  }
  return new ethers.Contract(
    IDO_CONTRACT_ADDRESS,
    IDO_ABI.abi,
    provider.getSigner()
  );
};

export const getNairaTokenContract = (provider: ethers.providers.Web3Provider) => {
  if (!NAIRA_TOKEN_ADDRESS) {
    throw new Error('Naira token contract address not configured');
  }
  return new ethers.Contract(
    NAIRA_TOKEN_ADDRESS,
    NAIRA_TOKEN_ABI.abi,
    provider.getSigner()
  );
};