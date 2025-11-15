'use client'
import { useState } from 'react';
import { CONTRACTS } from '@/lib/constants/contracts';
import { useTokenApprove } from '@/hooks/useTokenApprove';
import { useSwap } from '@/hooks/useSwap';
import { useAccount, useReadContract } from 'wagmi';
import ERC20ABI from '@/lib/abis/ERC20ABI.json';
export default function SwapPage() {
    const { address, isConnected } = useAccount();
    const [fromToken, setFromToken] = useState('USDT');
    const [toToken, setToToken] = useState('USDC');
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');

    const { approve, isPending, isConfirming, isSuccess } = useTokenApprove();
    const { swap, isPending: isSwapPending, isConfirming: isSwapConfirming, isSuccess: isSwapSuccess } = useSwap();

    // 检查授权额度
    const { data: allowance } = useReadContract({
        address: CONTRACTS[fromToken],
        abi: ERC20ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.SWAP] : undefined,
        enabled: !!address,
    });

    const handleApprove = async () => {
        if (!fromAmount) return

        try {
            await approve(CONTRACTS[fromToken], CONTRACTS.SWAP, fromAmount, 18)
        } catch (e) {
            alert('Approval failed: ' + e.message)
        }
    };

    const handleSwap = async () => {
        if (!fromAmount) return

        try {
            await swap(fromToken, toToken, fromAmount, 0.5) // 0.5% slippage
        } catch (e) {
            alert('Swap failed: ' + e.message)
        }
    };

    const needsApproval = allowance ? BigInt(allowance) < BigInt(fromAmount || 0) : true
    const tokens = ['ETH', 'USDT', 'USDC', 'DAI']

    const handleSwapTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* 标题 */}
                <h1 className="text-4xl font-bold text-white text-center mb-8">
                    Swap Tokens
                </h1>

                {/* Swap 卡片 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">

                    {/* From Token */}
                    <div className="mb-4">
                        <label className="text-white/70 text-sm mb-2 block">From</label>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <select
                                    value={fromToken}
                                    onChange={(e) => setFromToken(e.target.value)}
                                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {tokens.map(token => (
                                        <option key={token} value={token} className="bg-gray-800">
                                            {token}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-white/50 text-sm">Balance: 0.00</span>
                            </div>
                            <input
                                type="number"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-transparent text-white text-2xl font-semibold focus:outline-none placeholder-white/30"
                            />
                        </div>
                    </div>

                    {/* 交换按钮 */}
                    <div className="flex justify-center my-4">
                        <button
                            onClick={handleSwapTokens}
                            className="bg-white/10 hover:bg-white/20 rounded-full p-3 border border-white/20 transition-all"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                    </div>

                    {/* To Token */}
                    <div className="mb-6">
                        <label className="text-white/70 text-sm mb-2 block">To</label>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <select
                                    value={toToken}
                                    onChange={(e) => setToToken(e.target.value)}
                                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {tokens.map(token => (
                                        <option key={token} value={token} className="bg-gray-800">
                                            {token}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-white/50 text-sm">Balance: 0.00</span>
                            </div>
                            <input
                                type="number"
                                value={toAmount}
                                onChange={(e) => setToAmount(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-transparent text-white text-2xl font-semibold focus:outline-none placeholder-white/30"
                            />
                        </div>
                    </div>

                    {/* 兑换信息 */}
                    <div className="bg-white/5 rounded-lg p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70">Exchange Rate</span>
                            <span className="text-white">1 ETH = 2000 USDT</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70">Price Impact</span>
                            <span className="text-green-400">{'<'}0.01%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70">Network Fee</span>
                            <span className="text-white">~$2.50</span>
                        </div>
                    </div>

                    {/* Swap 按钮 */}
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50">
                        Connect Wallet to Swap
                    </button>
                </div>

                {/* 按钮逻辑 */}
                {/* 按钮逻辑 */}
                {!isConnected ? (
                    <button className="w-full bg-gray-600 text-white font-semibold py-4 rounded-xl cursor-not-allowed">
                        Please Connect Wallet
                    </button>
                ) : needsApproval ? (
                    <button
                        onClick={handleApprove}
                        disabled={isPending || isConfirming}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50"
                    >
                        {isPending ? 'Approving...' : isConfirming ? 'Confirming...' : 'Approve ' + fromToken}
                    </button>
                ) : (
                    <button
                        onClick={handleSwap}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg"
                    >
                        Swap
                    </button>
                )}

                {/* 成功提示 */}
                {isSuccess && (
                    <div className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                        <div className="text-green-400 font-semibold">✓ Approval Successful!</div>
                    </div>
                )}
            </div>
        </div>
    )
}