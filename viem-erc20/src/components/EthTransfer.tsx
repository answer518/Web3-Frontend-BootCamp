'use client';

import { useState, useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount, useChainId, useBalance } from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { sepolia } from 'wagmi/chains';
import { 
  formatAddress, 
  formatEthAmount, 
  formatTxHash, 
  copyToClipboard,
  isValidNumber 
} from '@/utils/format';
import { 
  formatError, 
  getErrorMessage,
  isUserRejectedError, 
  isInsufficientFundsError, 
  isPermissionError,
  safeExecute 
} from '@/utils/error';
import { useToast } from '@/components/Toast';

export default function EthTransfer() {
  // Toast 通知
  const { showError, showWarning, showSuccess } = useToast();
  
  // 获取用户账户信息
  const { address, isConnected } = useAccount();
  
  // 获取当前链 ID
  const chainId = useChainId();

  // 获取用户 ETH 余额
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    query: { enabled: !!address }
  });

  // 转账功能的状态管理
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transferError, setTransferError] = useState('');
  
  // 复制功能的状态管理
  const [copiedText, setCopiedText] = useState('');

  // 使用 useSendTransaction 发送 ETH
  const { sendTransaction, isPending: isSendPending, data: txHash } = useSendTransaction();

  // 使用 useWaitForTransactionReceipt 监听交易状态
  const { 
    isLoading: isConfirming, 
    isSuccess: isSuccess, 
    isError: isError,
    error: txError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // 处理复制功能
  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000); // 2秒后清除提示
    }
  };

  // 处理转账
  const handleTransfer = async () => {
    // 清除之前的错误
    setTransferError('');

    // 基础验证
    if (!isConnected) {
      showWarning('请先连接钱包');
      return;
    }

    if (chainId !== sepolia.id) {
      showWarning('请切换到 Sepolia 测试网络');
      return;
    }

    if (!toAddress.trim()) {
      showWarning('请输入接收方地址');
      return;
    }

    if (!isAddress(toAddress)) {
      showWarning('请输入有效的以太坊地址');
      return;
    }

    if (!amount.trim()) {
      showWarning('请输入转账金额');
      return;
    }

    // 使用格式化工具函数验证金额
    if (!isValidNumber(amount, 0)) {
      showWarning('请输入有效的转账金额');
      return;
    }

    const amountNum = parseFloat(amount);
    
    // 检查余额是否足够
    if (balance && parseFloat(formatEther(balance.value)) < amountNum) {
      showWarning('余额不足');
      return;
    }

    // 使用 safeExecute 包装转账操作
    await safeExecute(
      async () => {
        console.log('发送 ETH 转账:', {
          to: toAddress,
          amount: amount,
          amountInWei: parseEther(amount).toString()
        });

        sendTransaction({
          to: toAddress as `0x${string}`,
          value: parseEther(amount),
        });
      },
      (errorInfo) => {
          if (isUserRejectedError(errorInfo.originalError)) {
            showWarning('用户取消了交易');
            setTransferError('用户取消了交易');
          } else if (isInsufficientFundsError(errorInfo.originalError)) {
            showError('余额不足，无法支付 gas 费用');
            setTransferError('余额不足，无法支付 gas 费用');
          } else if (isPermissionError(errorInfo.originalError)) {
            showError('权限不足，请检查钱包设置');
            setTransferError('权限不足，请检查钱包设置');
          } else {
            showError(errorInfo.message);
            setTransferError(errorInfo.message);
          }
        }
    );
  };

  // 监听交易成功
  useEffect(() => {
    if (isSuccess) {
      console.log('ETH 转账成功！交易哈希:', txHash);
      // 刷新余额
      refetchBalance();
      // 显示成功通知
      showSuccess('ETH 转账成功！');
      
      // 使用 setTimeout 来避免在 effect 中直接调用 setState
      const timer = setTimeout(() => {
        setToAddress('');
        setAmount('');
        setTransferError('');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, txHash, refetchBalance, showSuccess]);

  // 处理交易错误
  useEffect(() => {
    if (isError && txError) {
      console.error('交易失败:', txError);
      const errorMessage = getErrorMessage(txError);
      
      // 使用 setTimeout 来避免在 effect 中直接调用 setState
      const timer = setTimeout(() => {
        setTransferError(errorMessage);
        showError(errorMessage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isError, txError, showError]);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
          </svg>
        </div>
        ETH 转账
      </h2>
      
      {/* 用户余额显示 */}
      {isConnected && balance && (
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">当前 ETH 余额</p>
              <p className="text-xl font-bold text-purple-600">
                {formatEthAmount(formatEther(balance.value))} ETH
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 接收方地址输入 */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <label htmlFor="toAddress" className="block text-sm font-semibold text-gray-700 mb-3">
            接收方地址
          </label>
          <div className="relative">
            <input
              type="text"
              id="toAddress"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x1234567890abcdef1234567890abcdef12345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              disabled={isSendPending || isConfirming}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          {toAddress && !isAddress(toAddress) && (
            <div className="mt-2 flex items-center text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm">请输入有效的以太坊地址</span>
            </div>
          )}
        </div>

        {/* 转账金额输入 */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-3">
            转账金额
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              step="0.001"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              disabled={isSendPending || isConfirming}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 font-medium">ETH</span>
            </div>
          </div>
          {balance && amount && parseFloat(amount) > parseFloat(formatEther(balance.value)) && (
            <div className="mt-2 flex items-center text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm">余额不足</span>
            </div>
          )}
        </div>
      </div>

      {/* 错误信息显示 */}
      {transferError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <div>
              <h4 className="font-semibold">转账失败</h4>
              <p className="text-sm mt-1">{transferError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 交易状态显示 */}
      {isSendPending && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <div>
              <h4 className="font-semibold">正在发送交易</h4>
              <p className="text-sm">请在钱包中确认交易...</p>
            </div>
          </div>
        </div>
      )}

      {isConfirming && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          <div className="flex items-center">
            <div className="animate-pulse rounded-full h-5 w-5 bg-yellow-500 mr-3"></div>
            <div>
              <h4 className="font-semibold">等待交易确认</h4>
              <p className="text-sm">交易已提交，正在等待网络确认...</p>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold">转账成功！</h4>
              <p className="text-sm mt-1">ETH 已成功发送到目标地址</p>
              <div className="mt-3 p-3 bg-white rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">交易哈希：</span>
                  <button
                    onClick={() => handleCopy(txHash || '', 'txHash')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {copiedText === 'txHash' ? '已复制' : '复制'}
                  </button>
                </div>
                <div className="mt-1 font-mono text-sm break-all">
                  {formatTxHash(txHash || '')}
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  在 Etherscan 上查看
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                    <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 转账按钮 */}
      <button
        onClick={handleTransfer}
        disabled={
          !isConnected || 
          !toAddress.trim() || 
          !amount.trim() || 
          isSendPending || 
          isConfirming || 
          chainId !== sepolia.id
          // (toAddress && !isAddress(toAddress)) ||
          // (balance && amount && parseFloat(amount) > parseFloat(formatEther(balance.value)))
        }
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {!isConnected ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
            </svg>
            请先连接钱包
          </span>
        ) : chainId !== sepolia.id ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            请切换到 Sepolia 测试网
          </span>
        ) : isSendPending ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            发送中...
          </span>
        ) : isConfirming ? (
          <span className="flex items-center justify-center">
            <div className="animate-pulse rounded-full h-5 w-5 bg-white mr-2"></div>
            确认中...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            发送 ETH
          </span>
        )}
      </button>

      {/* 网络提示 */}
      {isConnected && chainId !== sepolia.id && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
          <p className="text-orange-600 text-sm">
            请切换到 Sepolia 测试网络以使用此功能
          </p>
        </div>
      )}
    </div>
  );
}