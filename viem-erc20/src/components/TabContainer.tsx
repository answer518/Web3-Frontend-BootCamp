'use client';

import { useState } from 'react';
import Erc20Info from './Erc20Info';
import EthTransfer from './EthTransfer';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function TabContainer() {
  const [activeTab, setActiveTab] = useState('erc20');

  const tabs: TabItem[] = [
    {
      id: 'erc20',
      label: 'ERC20 代币',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
        </svg>
      ),
      content: <Erc20Info />
    },
    {
      id: 'eth-transfer',
      label: 'ETH 转账',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      ),
      content: <EthTransfer />
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Tab 导航栏 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <nav className="flex" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex-1 flex items-center justify-center px-6 py-5 text-sm font-semibold transition-all duration-300 ease-in-out
                ${activeTab === tab.id
                  ? 'text-purple-700 bg-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                }
                ${index === 0 ? 'rounded-tl-2xl' : ''}
                ${index === tabs.length - 1 ? 'rounded-tr-2xl' : ''}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <div className="flex items-center space-x-2">
                <div className={`transition-colors duration-300 ${
                  activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  {tab.icon}
                </div>
                <span>{tab.label}</span>
              </div>
              
              {/* 活跃状态指示器 */}
              {activeTab === tab.id && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-full"></div>
              )}
              
              {/* 悬浮效果 */}
              <div className={`
                absolute inset-0 rounded-lg transition-opacity duration-300
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500/5 to-blue-500/5' 
                  : 'bg-transparent hover:bg-purple-500/5'
                }
              `}></div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab 内容区域 */}
      <div className="relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              transition-all duration-300 ease-in-out
              ${activeTab === tab.id 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
              }
            `}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
          >
            <div className="p-1">
              {tab.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}