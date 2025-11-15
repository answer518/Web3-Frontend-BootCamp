// 合约地址（从 .env.local 或直接配置）
export const CONTRACTS = {
  // ERC20 代币
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || '0x...',
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x...',

  // DEX 合约
  SWAP: process.env.NEXT_PUBLIC_SWAP_ADDRESS || '0x...',
  STAKE_POOL: process.env.NEXT_PUBLIC_STAKE_POOL_ADDRESS || '0x...',

  // Farm 合约
  FARM: process.env.NEXT_PUBLIC_FARM_ADDRESS || '0x...',
  REWARD_TOKEN: process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS || '0x...',

  // LaunchPad 合约
  LAUNCHPAD: process.env.NEXT_PUBLIC_LAUNCHPAD_ADDRESS || '0x...',
}