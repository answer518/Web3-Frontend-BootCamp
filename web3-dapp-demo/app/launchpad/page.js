'use client'

import { useState } from 'react'

export default function LaunchPadPage() {
    const [selectedProject, setSelectedProject] = useState(null)
    const [investmentAmount, setInvestmentAmount] = useState('')

    // 模拟项目数据
    const mockProjects = [
        {
            id: 1,
            name: 'DeFi Protocol X',
            symbol: 'DPX',
            logo: '🚀',
            description: 'Next-generation decentralized lending protocol with AI-powered risk assessment',
            totalRaise: '500,000',
            raised: '350,000',
            participants: 1234,
            startTime: '2024-02-15',
            endTime: '2024-02-28',
            tokenPrice: '0.05',
            status: 'active',
            progress: 70
        },
        {
            id: 2,
            name: 'GameFi Arena',
            symbol: 'GFA',
            logo: '🎮',
            description: 'Play-to-earn metaverse gaming platform with NFT integration',
            totalRaise: '1,000,000',
            raised: '1,000,000',
            participants: 3456,
            startTime: '2024-01-20',
            endTime: '2024-02-05',
            tokenPrice: '0.10',
            status: 'completed',
            progress: 100
        },
        {
            id: 3,
            name: 'Green Energy DAO',
            symbol: 'GED',
            logo: '🌱',
            description: 'Decentralized renewable energy financing and carbon credit marketplace',
            totalRaise: '750,000',
            raised: '125,000',
            participants: 567,
            startTime: '2024-03-01',
            endTime: '2024-03-15',
            tokenPrice: '0.08',
            status: 'upcoming',
            progress: 0
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-500/20 text-green-400 border-green-500/30',
            completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        }
        return badges[status] || badges.upcoming
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* 页面标题 */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        🚀 LaunchPad
                    </h1>
                    <p className="text-white/70 text-lg">
                        Discover and invest in promising blockchain projects
                    </p>
                </div>

                {/* 项目列表 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {mockProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-purple-400/50 transition-all cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* 项目头部 */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="text-4xl mr-3">{project.logo}</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                                        <div className="text-white/50 text-sm">${project.symbol}</div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(project.status)}`}>
                                    {project.status.toUpperCase()}
                                </div>
                            </div>

                            {/* 项目描述 */}
                            <p className="text-white/70 text-sm mb-4 line-clamp-2">
                                {project.description}
                            </p>

                            {/* 筹资进度 */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/70">Progress</span>
                                    <span className="text-white font-semibold">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* 项目数据 */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-white/50 text-xs mb-1">Raised</div>
                                    <div className="text-white font-semibold">${project.raised}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-white/50 text-xs mb-1">Goal</div>
                                    <div className="text-white font-semibold">${project.totalRaise}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-white/50 text-xs mb-1">Token Price</div>
                                    <div className="text-white font-semibold">${project.tokenPrice}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-white/50 text-xs mb-1">Participants</div>
                                    <div className="text-white font-semibold">{project.participants}</div>
                                </div>
                            </div>

                            {/* 操作按钮 */}
                            {project.status === 'active' ? (
                                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50">
                                    Invest Now
                                </button>
                            ) : project.status === 'upcoming' ? (
                                <button className="w-full bg-white/10 text-white/70 font-semibold py-3 rounded-xl cursor-not-allowed">
                                    Coming Soon
                                </button>
                            ) : (
                                <button className="w-full bg-white/10 text-white/70 font-semibold py-3 rounded-xl cursor-not-allowed">
                                    Sale Ended
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* 项目详情弹窗 */}
                {selectedProject && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedProject(null)}>
                        <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-white/20"
                            onClick={(e) => e.stopPropagation()}>

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center">
                                    <div className="text-5xl mr-4">{selectedProject.logo}</div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">{selectedProject.name}</h2>
                                        <div className="text-white/50">${selectedProject.symbol}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-white/70 hover:text-white text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-white/70 mb-6">{selectedProject.description}</p>

                            {/* 投资输入 */}
                            {selectedProject.status === 'active' && (
                                <div className="bg-white/5 rounded-xl p-6 mb-6">
                                    <label className="text-white/70 text-sm mb-2 block">Investment Amount (USDT)</label>
                                    <div className="flex items-center bg-white/10 rounded-lg px-4 py-3 mb-4">
                                        <input
                                            type="number"
                                            value={investAmount}
                                            onChange={(e) => setInvestAmount(e.target.value)}
                                            placeholder="0.0"
                                            className="flex-1 bg-transparent text-white text-xl font-semibold focus:outline-none placeholder-white/30"
                                        />
                                        <button className="text-purple-400 text-sm font-semibold hover:text-purple-300">
                                            MAX
                                        </button>
                                    </div>

                                    <div className="flex justify-between text-sm text-white/70 mb-4">
                                        <span>You will receive:</span>
                                        <span className="text-white font-semibold">
                                            {investAmount ? (parseFloat(investAmount) / parseFloat(selectedProject.tokenPrice)).toFixed(2) : '0.00'} {selectedProject.symbol}
                                        </span>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50">
                                        Confirm Investment
                                    </button>
                                </div>
                            )}

                            {/* 项目时间线 */}
                            <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="text-white font-semibold mb-4">Timeline</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Start Date:</span>
                                        <span className="text-white">{selectedProject.startTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">End Date:</span>
                                        <span className="text-white">{selectedProject.endTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Status:</span>
                                        <span className={`font-semibold ${selectedProject.status === 'active' ? 'text-green-400' :
                                                selectedProject.status === 'completed' ? 'text-gray-400' :
                                                    'text-blue-400'
                                            }`}>
                                            {selectedProject.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}