'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import TabContainer from '@/components/TabContainer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Connect Button */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Viem ERC20 DApp
        </h1>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            欢迎使用 ERC20 代币交互平台
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            这是一个基于 Viem 和 RainbowKit 构建的去中心化应用，支持 ERC20 代币的读取、铸造和 ETH 转账功能。
          </p>
        </div>

        {/* Tab 容器 - 包含 ERC20 信息和 ETH 转账功能 */}
        <div className="mb-12">
          <TabContainer />
        </div>
        
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              开始使用
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              请先连接您的钱包以开始使用 DApp 功能
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
