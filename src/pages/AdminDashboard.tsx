import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserStatus, type UserProfile } from '../services/usersService';
import { Check, X, Clock, Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const userList = await getAllUsers();
            // Sort: pending first, then by lastLogin
            userList.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return (b.lastLogin?.seconds || 0) - (a.lastLogin?.seconds || 0);
            });
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, isAdmin, navigate]);

    const handleStatusUpdate = async (uid: string, newStatus: 'pending' | 'approved' | 'rejected') => {
        try {
            await updateUserStatus(uid, newStatus);
            // Optimistic update
            setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update user status");
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading users...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900">
            <h1 className="text-3xl font-bold text-white mb-2">관리자 대시보드</h1>
            <p className="text-gray-400 mb-8">사용자 승인 및 관리</p>

            <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">사용자</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">이메일</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">상태</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">권한</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">최초 로그인</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">로그인 횟수</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">최근 로그인</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((userData) => (
                                <tr key={userData.uid} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {userData.photoURL ? (
                                            <img src={userData.photoURL} alt="" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-600" />
                                        )}
                                        <span className="font-medium text-white">{userData.displayName || '이름 없음'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{userData.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${userData.status === 'approved'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : userData.status === 'pending'
                                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {userData.status === 'approved' && <Check size={12} />}
                                            {userData.status === 'pending' && <Clock size={12} />}
                                            {userData.status === 'rejected' && <X size={12} />}
                                            {userData.status === 'approved' ? '승인됨' : userData.status === 'pending' ? '승인 대기' : '거절됨'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {userData.role === 'admin' ? (
                                            <span className="flex items-center gap-1 text-purple-400 text-sm font-medium">
                                                <Shield size={14} /> 관리자
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-sm">일반 사용자</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {userData.firstLogin?.toDate().toLocaleString('ko-KR') || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {userData.loginCount || 1}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {userData.lastLogin?.toDate().toLocaleString('ko-KR') || '기록 없음'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {userData.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(userData.uid, 'approved')}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                                >
                                                    승인하기
                                                </button>
                                            )}
                                            {userData.status === 'approved' && userData.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(userData.uid, 'pending')}
                                                    className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors"
                                                >
                                                    대기 전환
                                                </button>
                                            )}
                                            {userData.role === 'admin' && (
                                                <span className="text-xs text-gray-600 italic">관리자 계정</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
