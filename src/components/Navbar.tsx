import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-white border-b border-snow-200 px-8 py-4 flex justify-between items-center">
            <div className="text-xl font-bold text-snow-900 cursor-pointer" onClick={() => navigate('/')}>멘토 에이전트</div>

            <div className="flex items-center gap-6">
                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-snow-600 hover:text-snow-900 font-medium transition-colors"
                    >
                        관리자 대시보드
                    </button>
                )}
                <div className="flex items-center gap-2 text-snow-600">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
                    ) : (
                        <UserIcon size={20} />
                    )}
                    <span className="hidden sm:inline">{user?.displayName}</span>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-snow-500 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">로그아웃</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
