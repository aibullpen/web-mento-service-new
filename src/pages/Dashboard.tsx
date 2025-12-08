import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowLeft, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createDocument } from '../services/googleDocsService';

const agents = [
    {
        id: 'autocustomer',
        name: 'step1 자동 고객문제가설검증',
        description: '사업아이디어에 대한 고객페르소나,문제가설,인터뷰,가설검증 수행',
        url: 'https://startup-mentor-orchestrator-836633887166.us-west1.run.app/?code=corn2020',
        icon: '📊'
    },
    {
        id: 'aotoproblem',
        name: 'step1 자동 문제정의',
        description: '아이디어에 맞는 고객문제',
        url: 'https://cornax-step1-problem-definition-ai-124105313078.us-west1.run.app/?code=corn2020',
        icon: '📊'
    },
    {
        id: 'automerket',
        name: 'step2 자동 경쟁분석',
        description: '문제정의로 시장조사',
        url: 'https://cornax-step2-market-review-124105313078.us-west1.run.app/?code=corn2020',
        icon: '🧐'
    },
    {
        id: 'talkmarket',
        name: 'step1 대화로 경쟁분석',
        description: '경쟁사 제품에 대한 조사',
        url: 'https://corn-competitor-analysis-ai-124105313078.us-west1.run.app/?code=corn2020',
        icon: '📊'
    },
    {
        id: 'talkproblem',
        name: 'step2 대화로 문제정의',
        description: '고객관찰을 통한 문제정의',
        url: 'https://corn-ax-problem-definition-ai-mentor-v1-0-124105313078.us-west1.run.app/?code=corn2020',
        icon: '🧐'
    },
    {
        id: 'talksolution',
        name: 'step3 대화로 해결제안',
        description: '문제 해결을 위한 핵심기술 제안',
        url: 'https://corn-solution-architect-124105313078.us-west1.run.app/?code=corn2020',
        icon: '💡'
    },
    {
        id: 'autonero',
        name: 'fullstep 자동 고객개발',
        description: '사업아이디어를 한번에 고객개발계획서로 제작하는 멘토',
        url: 'https://nero-corn-customer-development-ai-124105313078.us-west1.run.app/?code=corn2020',
        icon: '😄'
    },
    {
        id: 'talkjjangga2',
        name: 'fullstep 대화로 고객개발',
        description: '단계별 대화하며 고객개발계획서를 제작하는 멘토',
        url: 'https://corn-jjangga-ai-2-705803452864.us-west1.run.app/?code=cornchip',
        icon: '🦸‍♂️'
    }
];

const Dashboard: React.FC = () => {
    const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
    const { googleAccessToken } = useAuth();
    const [saveStatus, setSaveStatus] = useState<string>('');
    const [showManualSave, setShowManualSave] = useState(false);
    const [manualContent, setManualContent] = useState('');
    const [manualTitle, setManualTitle] = useState('');

    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.data && event.data.type === 'AGENT_COMPLETE' && event.data.content) {
                console.log("Received agent completion message", event.data);
                handleSave(event.data.content);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [googleAccessToken, selectedAgent]);

    const handleSave = async (content: string, customTitle?: string) => {
        if (!googleAccessToken) {
            alert("Unexpected Error: Cannot save to Google Docs. Please re-login to grant permissions.");
            return;
        }

        setSaveStatus('Saving to Google Docs...');
        try {
            const title = customTitle || `${selectedAgent?.name || 'Agent'} Result - ${new Date().toLocaleString()}`;
            await createDocument(title, content, googleAccessToken);
            setSaveStatus('Saved to Google Docs!');
            alert(`Successfully saved "${title}" to your Google Docs!`);
            setTimeout(() => setSaveStatus(''), 3000);
            setShowManualSave(false);
            setManualContent('');
            setManualTitle('');
        } catch (error) {
            console.error("Failed to save to docs", error);
            setSaveStatus('Failed to save to Google Docs');
            alert("Failed to save to Google Docs. See console for details.");
        }
    };

    if (selectedAgent) {
        return (
            <div className="flex flex-col h-[calc(100vh-64px)] relative">
                {/* Manual Save Modal */}
                {showManualSave && (
                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="text-lg font-bold">Save Artifact to Google Docs</h3>
                                <button onClick={() => setShowManualSave(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                                    <input
                                        type="text"
                                        value={manualTitle}
                                        onChange={(e) => setManualTitle(e.target.value)}
                                        placeholder={`${selectedAgent.name} Result`}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Paste Markdown Content</label>
                                    <textarea
                                        value={manualContent}
                                        onChange={(e) => setManualContent(e.target.value)}
                                        className="w-full flex-1 border rounded-lg p-2 font-mono text-sm"
                                        placeholder="# Paste your markdown here..."
                                        style={{ minHeight: '200px' }}
                                    />
                                </div>
                            </div>
                            <div className="p-4 border-t flex justify-end gap-2">
                                <button
                                    onClick={() => setShowManualSave(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSave(manualContent, manualTitle)}
                                    disabled={!manualContent.trim() || saveStatus.includes('Saving')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saveStatus.includes('Saving') ? 'Saving...' : 'Save to Docs'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white border-b border-snow-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedAgent(null)}
                            className="p-2 hover:bg-snow-100 rounded-full transition-colors text-snow-600 hover:text-snow-900"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{selectedAgent.icon}</span>
                            <h1 className="text-lg font-bold text-snow-900">{selectedAgent.name}</h1>
                            {saveStatus && !showManualSave && (
                                <span className={`text-sm px-3 py-1 rounded-full ${saveStatus.includes('Failed') ? 'bg-red-100 text-red-700' :
                                    saveStatus.includes('Saved') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {saveStatus}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowManualSave(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <FileText size={18} />
                        Save Manual Artifact
                    </button>
                </div>
                <div className="flex-1 bg-snow-50">
                    <iframe
                        src={selectedAgent.url}
                        className="w-full h-full border-0"
                        title={selectedAgent.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900">
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">사용 가능한 에이전트</h1>

                {/* Box 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Group 1: step1 자동 고객문제가설검증 */}
                    <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                            <h2 className="text-lg font-bold text-white">자동 고객문제 가설검증</h2>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {agents.filter(a => ['autocustomer'].includes(a.id)).map(agent => (
                                <div
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{agent.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium truncate">{agent.name}</h3>
                                        <p className="text-sm text-gray-400 truncate">{agent.description}</p>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Group 2: step1 자동 문제정의, step2 자동 경쟁분석 */}
                    <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                            <h2 className="text-lg font-bold text-white">자동 문제정의 & 경쟁분석</h2>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {agents.filter(a => ['aotoproblem', 'automerket'].includes(a.id)).map(agent => (
                                <div
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{agent.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium truncate">{agent.name}</h3>
                                        <p className="text-sm text-gray-400 truncate">{agent.description}</p>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Group 3: step1 대화로 경쟁분석, step2 대화로 문제정의, step3 대화로 해결제안 */}
                    <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                            <h2 className="text-lg font-bold text-white">대화형 분석 & 해결</h2>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {agents.filter(a => ['talkmarket', 'talkproblem', 'talksolution'].includes(a.id)).map(agent => (
                                <div
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{agent.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium truncate">{agent.name}</h3>
                                        <p className="text-sm text-gray-400 truncate">{agent.description}</p>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Group 4: fullstep 자동 고객개발, fullstep 대화로 고객개발 */}
                    <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                            <h2 className="text-lg font-bold text-white">Full Step 고객개발</h2>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {agents.filter(a => ['autonero', 'talkjjangga2'].includes(a.id)).map(agent => (
                                <div
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{agent.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium truncate">{agent.name}</h3>
                                        <p className="text-sm text-gray-400 truncate">{agent.description}</p>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
