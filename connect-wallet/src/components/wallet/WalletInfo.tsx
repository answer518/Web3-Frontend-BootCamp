'use client';

import { useAccount, useBalance, useChainId } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const WalletInfo = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  });

  // 获取当前网络名称
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case mainnet.id:
        return '以太坊主网';
      case sepolia.id:
        return 'Sepolia 测试网';
      default:
        return `未知网络 (${chainId})`;
    }
  };

  // 截断地址显示
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 max-w-md w-full transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          钱包信息
        </h2>
      </div>
      
      <div className="space-y-4">
        {/* 钱包地址 */}
        <div className="group">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              钱包地址
            </label>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-blue-100 dark:border-gray-600 group-hover:shadow-md transition-all duration-200">
            <code className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {truncateAddress(address)}
            </code>
          </div>
        </div>

        {/* 当前网络 */}
        <div className="group">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              当前网络
            </label>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-green-100 dark:border-gray-600 group-hover:shadow-md transition-all duration-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {getNetworkName(chainId)}
              </span>
            </div>
          </div>
        </div>

        {/* 余额 */}
        <div className="group">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              余额
            </label>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-purple-100 dark:border-gray-600 group-hover:shadow-md transition-all duration-200">
            {balanceLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-200 border-t-purple-600 mr-3"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">加载中...</span>
              </div>
            ) : balance ? (
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {parseFloat(balance.formatted).toFixed(4)}
                </span>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-lg">
                  {balance.symbol}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                无法获取余额
              </span>
            )}
          </div>
        </div>

        {/* 完整地址（可复制） */}
        <div className="group">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              完整地址
            </label>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-orange-100 dark:border-gray-600 group-hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between gap-3">
              <code className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all flex-1">
                {address}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  // 可以添加复制成功的提示
                }}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-2 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
                title="复制地址"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};