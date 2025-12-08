import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import dashboardBg from '../assets/dashboard-bg.jpg';

const Login: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${dashboardBg})` }}
        >
            <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-white/50">
                <h1 className="text-3xl font-bold text-snow-900 mb-2">CORN AX 에이전트</h1>
                <p className="text-snow-700 mb-8 font-medium">에이전트를 사용하려면 로그인하세요</p>

                <button
                    onClick={login}
                    className="w-full flex items-center justify-center gap-3 bg-snow-900 text-white py-3 px-4 rounded-xl hover:bg-snow-800 transition-colors duration-200 font-medium shadow-lg"
                >
                    <LogIn size={20} />
                    Google 계정으로 로그인
                </button>
            </div>
        </div>
    );
};

export default Login;
