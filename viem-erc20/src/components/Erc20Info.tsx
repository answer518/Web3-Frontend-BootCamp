'use client';

import { useState, useEffect } from 'react';
import { useReadContracts, useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { sepolia } from 'wagmi/chains';
import { erc20ContractAddress, erc20Abi } from '@/constants';
import { 
  formatAddress, 
  formatTokenAmount, 
  formatTxHash, 
  copyToClipboard,
  isValidNumber 
} from '@/utils/format';
import { 
  formatError, 
  isUserRejectedError, 
  isInsufficientFundsError,
  isPermissionError,
  safeExecute 
} from '@/utils/error';
import { useToast } from '@/components/Toast';

export default function Erc20Info() {
  // 获取用户账户信息
  const { address, isConnected } = useAccount();
  
  // 获取当前链 ID
  const chainId = useChainId();

  // Toast 通知
  const { showError, showSuccess, showWarning } = useToast();

  // Mint 功能的状态管理
  const [mintAmount, setMintAmount] = useState('');
  const [mintError, setMintError] = useState('');
  
  // 复制功能的状态管理
  const [copiedText, setCopiedText] = useState('');

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
      showSuccess('铸造交易已确认！代币已成功铸造到您的账户');
      // 使用 setTimeout 避免在 effect 中直接调用 setState
      setTimeout(() => {
        setMintAmount('');
        setMintError('');
      }, 0);
    }
  }, [isMintSuccess, refetch, showSuccess]);

  // 监听交易错误状态
  useEffect(() => {
    if (isMintError && mintTxError) {
      console.error('交易确认失败:', mintTxError);
      
      // 使用统一的错误处理
      const formattedError = formatError(mintTxError);
      showError(`交易失败: ${formattedError.message}`);
      // 使用 setTimeout 避免在 effect 中直接调用 setState
      setTimeout(() => {
        setMintError(formattedError.message);
      }, 0);
    }
  }, [isMintError, mintTxError, showError]);

  // 处理复制功能
  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000); // 2秒后清除提示
    }
  };

  // 处理输入框变化
  const handleMintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMintAmount(value);
    
    // 清除之前的错误
    setMintError('');
    
    // 使用格式化工具函数验证输入
    if (value && !isValidNumber(value, 0, 10000)) {
      if (isNaN(Number(value))) {
        setMintError('请输入有效的数字');
      } else if (Number(value) > 10000) {
        setMintError('铸造数量不能超过 10,000');
      } else if (Number(value) <= 0) {
        setMintError('铸造数量必须大于 0');
      }
      return;
    }
  };

  // 处理 Mint 操作
  const handleMint = async () => {
    console.log('开始 Mint 操作...');
    console.log('钱包连接状态:', { isConnected, address });
    console.log('当前网络 ID:', chainId);
    console.log('铸造数量:', mintAmount);

    // 基础验证
    if (!isConnected || !address) {
      const errorMsg = '请先连接钱包';
      setMintError(errorMsg);
      showError(errorMsg);
      return;
    }

    // 检查网络是否为 Sepolia
    if (chainId !== sepolia.id) {
      const errorMsg = `请切换到 Sepolia 测试网络。当前网络 ID: ${chainId}, 需要: ${sepolia.id}`;
      setMintError(errorMsg);
      showWarning(errorMsg);
      return;
    }

    if (!mintAmount || Number(mintAmount) <= 0) {
      const errorMsg = '请输入有效的铸造数量';
      setMintError(errorMsg);
      showError(errorMsg);
      return;
    }

    // 检查用户是否为合约所有者
    // const contractOwner = data?.[0]?.result as string;
    // console.log('合约所有者:', contractOwner);
    // console.log('当前用户地址:', address);
    
    // if (contractOwner && address && contractOwner.toLowerCase() !== address.toLowerCase()) {
    //   setMintError(`权限不足：只有合约所有者才能铸造代币。\n合约所有者: ${contractOwner}\n当前用户: ${address}`);
    //   return;
    // }

    // 使用 safeExecute 包装 mint 操作
    await safeExecute(
      async () => {
        // 清除之前的错误
        setMintError('');
        
        // 将输入的数量转换为 wei（18 位小数）
        const amountInWei = parseUnits(mintAmount, 18);
        console.log('转换后的数量 (wei):', amountInWei.toString());
        
        // 验证合约地址格式
        if (!erc20ContractAddress || erc20ContractAddress.length !== 42) {
          throw new Error('无效的合约地址');
        }
        
        console.log('调用合约参数:', {
          address: erc20ContractAddress,
          functionName: 'mint',
          args: [amountInWei],
          abi: erc20Abi
        });
        
        // 调用合约的 mint 函数
        writeContract({
          abi: erc20Abi,
          address: erc20ContractAddress,
          functionName: 'mint',
          args: [amountInWei]
        });
        
        // 如果执行到这里，说明交易提交成功
        console.log('Mint 操作提交成功');
        showSuccess('铸造交易已提交，请等待确认');
      },
      (errorInfo) => {
        console.error('Mint 操作失败:', errorInfo);
        
        // 设置错误信息
        setMintError(errorInfo.message);
        
        // 根据错误类型显示不同的 Toast
        if (errorInfo.type === 'USER_REJECTED') {
          showWarning('用户取消了交易');
        } else if (errorInfo.type === 'INSUFFICIENT_FUNDS') {
          showError('账户余额不足以支付 Gas 费用');
        } else if (errorInfo.type === 'PERMISSION_DENIED') {
          showError('权限错误：只有合约所有者才能执行此操作');
        } else {
          showError(errorInfo.message);
        }
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          ERC20 合约信息
        </h2>
        
        <div className="space-y-4">
          {/* 合约地址 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">合约地址</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                {formatAddress(erc20ContractAddress)}
              </p>
              <button
                onClick={() => handleCopy(erc20ContractAddress, 'address')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="复制地址"
              >
                {copiedText === 'address' ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 合约发行方 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">合约发行方 (Owner)</h3>
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">加载中...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-red-600">加载失败</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                  {owner ? formatAddress(owner) : '未知'}
                </p>
                {owner && (
                  <button
                    onClick={() => handleCopy(owner, 'owner')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="复制地址"
                  >
                    {copiedText === 'owner' ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 总发行量 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">总发行量 (Total Supply)</h3>
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">加载中...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-red-600">加载失败</span>
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-800">
                {totalSupply ? formatTokenAmount(formatUnits(totalSupply, 18)) : '0'} 代币
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                  </svg>
                </div>
                铸造代币 (Mint)
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <label htmlFor="mintAmount" className="block text-sm font-semibold text-gray-700 mb-3">
                    铸造数量
                  </label>
                  <div className="relative">
                    <input
                      id="mintAmount"
                      type="number"
                      value={mintAmount}
                      onChange={handleMintAmountChange}
                      placeholder="请输入要铸造的代币数量（最多 10,000）"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        mintError 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      disabled={isMintPending}
                      min="0"
                      max="10000"
                      step="0.000000000000000001"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm">代币</span>
                    </div>
                  </div>
                  {mintError && (
                    <div className="mt-2 flex items-center text-red-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm">{mintError}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleMint}
                  disabled={isMintPending || !mintAmount || !!mintError}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg"
                >
                  {isMintPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      铸造中...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                      </svg>
                      铸造代币
                    </div>
                  )}
                </button>

                {/* 交易状态反馈 */}
                {mintTxHash && (
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {isMintConfirming ? (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          </div>
                        ) : isMintSuccess ? (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {isMintConfirming ? '等待交易确认...' : isMintSuccess ? '交易已确认！' : '交易已提交'}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          交易哈希: 
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {formatTxHash(mintTxHash)}
                            </span>
                            <button
                              onClick={() => handleCopy(mintTxHash, 'txHash')}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="复制交易哈希"
                            >
                              {copiedText === 'txHash' ? (
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        {isMintSuccess && (
                          <div className="mt-2 text-sm text-green-600 font-medium">
                            ✅ 代币铸造成功！余额已更新
                          </div>
                        )}
                        {isMintError && (
                          <div className="mt-2 text-sm text-red-600 font-medium">
                            ❌ 交易失败
                            {mintTxError && (
                              <div className="text-xs mt-1">{mintTxError.message}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-sm text-blue-700">
                      点击&quot;铸造代币&quot;按钮后，钱包将弹出交易确认请求。请确认交易详情并支付相应的 Gas 费用。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm text-red-600">
                  读取合约信息时发生错误，请检查网络连接或稍后重试。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}