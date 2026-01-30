// Deposit types based on PRD specifications

export type DepositStatus = 
  | 'PENDING_TX'      // Waiting for user to transfer
  | 'CONFIRMING'      // Transaction detected, waiting for 15 block confirmations
  | 'PENDING_CLAIM'   // Amount < 10 USDT, needs manual claim
  | 'CONFIRMED'       // Confirmed on chain
  | 'CREDITED'        // Credited to account
  | 'REORG_DETECTED'; // Chain reorganization detected

export type SupportedToken = 'USDT' | 'USDC';

export interface DepositRecord {
  id: string;
  txHash: string;
  amount: number;
  token: SupportedToken;
  status: DepositStatus;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  confirmedAt?: string;
  creditedAt?: string;
}

export interface CustodyConfig {
  address: string;
  network: string;
  chainId: number;
  tokens: {
    symbol: SupportedToken;
    address: string;
    decimals: number;
    minAmount: number;
  }[];
}

// Mock custody configuration (will be replaced with real config from chain-service)
export const CUSTODY_CONFIG: CustodyConfig = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f5B3E1',
  network: 'BSC (BNB Smart Chain)',
  chainId: 56,
  tokens: [
    {
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      minAmount: 10,
    },
    {
      symbol: 'USDC',
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      decimals: 18,
      minAmount: 10,
    },
  ],
};

export const CONFIRMATION_BLOCKS = 15;
export const ESTIMATED_BLOCK_TIME_SECONDS = 3; // BSC ~3 seconds per block
