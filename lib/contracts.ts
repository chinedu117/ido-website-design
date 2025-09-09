// First, create a new file: lib/contracts.ts
import { ethers } from 'ethers'
import IDO_ABI from '@/contracts/abi-MedChainIDO.json'

export const IDO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS

export const getIDOContract = (provider: ethers.providers.Web3Provider) => {
  return new ethers.Contract(
    IDO_CONTRACT_ADDRESS!,
    IDO_ABI.abi,
    provider.getSigner()
  )
}