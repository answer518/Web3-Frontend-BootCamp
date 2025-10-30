'use client';

import { useState, useEffect } from 'react';
import { useReadContracts, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { erc20ContractAddress, erc20Abi } from '@/constants';

export default function Erc20Info() {
  // 获取用户账户信息
  const { address, isConnected } = useAccount();

  // Mint 功能的状态管理
  const [mintAmount, setMintAmount] = useState('');
  const [mintError, setMintError] = useState('');

  // 使用 useWriteContract 配置 mint 函数
  const { writeContract, isPending: isMintPending, data: mintTxHash } = useWriteContract();

  // 使用 useWaitForTransactionReceipt 监听交易状态
  const { 
    isLoading: isMintConfirming, 
    isSuccess: isMintSuccess, 
    isError: isMintError,
    error: mintTxError 
  } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  // 使用 useReadContracts 并行读取合约的 owner、totalSupply 和用户余额
  const { data, isPending, error, refetch } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: erc20ContractAddress,
        functionName: 'owner'
      },
      {
        abi: erc20Abi,
        address: erc20ContractAddress,
        functionName: 'totalSupply'
      },
      // 只有在用户连接钱包时才读取余额
      ...(isConnected && address ? [{
        abi: erc20Abi,
        address: erc20ContractAddress,
        functionName: 'balanceOf',
        args: [address]
      }] : [])
    ]
  });

  // 解构数据
  const [ownerResult, totalSupplyResult, balanceResult] = data || [];
  const owner = ownerResult?.result as string;
  const totalSupply = totalSupplyResult?.result as bigint;
  const userBalance = balanceResult?.result as bigint;

  // 监听交易成功状态，自动刷新余额
  useEffect(() => {
    if (isMintSuccess) {
      // 交易成功后刷新合约数据（包括用户余额和总发行量）
      refetch();
    }
  }, [isMintSuccess, refetch]);

  // 处理输入框变化
  const handleMintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMintAmount(value);
    
    // 清除之前的错误
    setMintError('');
    
    // 验证输入
    if (value && isNaN(Number(value))) {
      setMintError('请输入有效的数字');
      return;
    }
    
    if (value && Number(value) > 10000) {
      setMintError('铸造数量不能超过 10,000');
      return;
    }
    
    if (value && Number(value) <= 0) {
      setMintError('铸造数量必须大于 0');
      return;
    }
  };

  // 处理 Mint 操作
  const handleMint = async () => {
    if (!isConnected || !address) {
      setMintError('请先连接钱包');
      return;
    }

    if (!mintAmount || Number(mintAmount) <= 0) {
      setMintError('请输入有效的铸造数量');
      return;
    }

    try {
      // 将输入的数量转换为 wei（18 位小数）
      const amountInWei = parseUnits(mintAmount, 18);
      
      // 调用合约的 mint 函数
      writeContract({
        abi: erc20Abi,
        address: erc20ContractAddress,
        functionName: 'mint',
        args: [address, amountInWei]
      });
    } catch (error) {
      console.error('Mint error:', error);
      setMintError('铸造失败，请重试');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ERC20 合约信息
        </h2>
        
        <div className="space-y-4">
          {/* 合约地址 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">合约地址</h3>
            <p className="text-sm font-mono text-gray-800 break-all">
              {erc20ContractAddress}
            </p>
          </div>

          {/* 合约发行方 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">合约发行方 (Owner)</h3>
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">加载中...</span>
              </div>
            ) : error ? (
              <p className="text-sm text-red-600">加载失败</p>
            ) : (
              <p className="text-sm font-mono text-gray-800 break-all">
                {owner || '未知'}
              </p>
            )}
          </div>

          {/* 总发行量 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">总发行量 (Total Supply)</h3>
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">加载中...</span>
              </div>
            ) : error ? (
              <p className="text-sm text-red-600">加载失败</p>
            ) : (
              <p className="text-lg font-semibold text-gray-800">
                {totalSupply ? formatUnits(totalSupply, 18) : '0'} 代币
              </p>
            )}
          </div>

          {/* 用户代币余额 - 仅在连接钱包时显示 */}
          {isConnected && address && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-sm font-medium text-blue-700 mb-2">我的代币余额</h3>
              <div className="flex items-center justify-between">
                <div>
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-600">加载中...</span>
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-600">加载失败</p>
                  ) : (
                    <p className="text-lg font-semibold text-blue-800">
                      {userBalance ? formatUnits(userBalance, 18) : '0'} 代币
                    </p>
                  )}
                </div>
                <div className="text-xs text-blue-600 font-mono break-all max-w-32">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
            </div>
          )}

          {/* Mint 功能 - 仅在连接钱包时显示 */}
          {isConnected && address && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="text-sm font-medium text-green-700 mb-4">铸造代币 (Mint)</h3>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="mintAmount" className="block text-sm font-medium text-green-700 mb-1">
                    铸造数量
                  </label>
                  <input
                    id="mintAmount"
                    type="number"
                    value={mintAmount}
                    onChange={handleMintAmountChange}
                    placeholder="请输入要铸造的代币数量（最多 10,000）"
                    className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isMintPending}
                    min="0"
                    max="10000"
                    step="0.000000000000000001"
                  />
                </div>

                {/* 错误信息 */}
                {mintError && (
                  <p className="text-sm text-red-600">{mintError}</p>
                )}

                <button
                  onClick={handleMint}
                  disabled={isMintPending || !mintAmount || !!mintError}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isMintPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>铸造中...</span>
                    </>
                  ) : (
                    <span>铸造代币</span>
                  )}
                </button>

                {/* 交易状态反馈 */}
                {mintTxHash && (
                  <div className="mt-3 p-3 rounded-md border">
                    {isMintConfirming && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">交易已发送，等待区块链确认...</span>
                      </div>
                    )}
                    
                    {isMintSuccess && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">铸造成功！代币已添加到您的账户</span>
                      </div>
                    )}
                    
                    {isMintError && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                          <span className="text-sm font-medium">交易失败</span>
                          {mintTxError && (
                            <p className="text-xs mt-1">{mintTxError.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {mintTxHash && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span>交易哈希: </span>
                        <span className="font-mono break-all">{mintTxHash}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-green-600">
                   点击&ldquo;铸造代币&rdquo;按钮后，钱包将弹出交易确认请求
                </p>
              </div>
            </div>
          )}

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">
                读取合约信息时发生错误，请检查网络连接或稍后重试。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}