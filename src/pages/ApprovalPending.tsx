import React from 'react';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ApprovalPending: React.FC = () => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-900/50 p-4 rounded-full">
                        <Clock size={48} className="text-blue-400" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">승인 대기 중</h1>
                <p className="text-gray-400 mb-6">
                    안녕하세요, <span className="text-white font-medium">{user?.displayName}</span>님.<br />
                    관리자의 승인을 기다려주세요.<br />
                    승인이 완료되면 대시보드로 이동할 수 있습니다.
                </p>

                <div className="bg-gray-900/50 rounded-lg p-4 mb-8 text-sm text-gray-500">
                    접속 계정: {user?.email}
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                    <LogOut size={18} />
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default ApprovalPending;
