import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
    onVerify: (isValid: boolean) => void;
}

export const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
    const [captchaCode, setCaptchaCode] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const generateCaptcha = () => {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        const length = 5;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptchaCode(result);
        setUserInput('');
        setIsVerified(false);
        onVerify(false);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setUserInput(value);
        if (value === captchaCode) {
            setIsVerified(true);
            onVerify(true);
        } else {
            setIsVerified(false);
            onVerify(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                {/* Visual Captcha Box */}
                <div
                    className="select-none relative overflow-hidden bg-slate-100 border border-slate-200 rounded-xl px-6 py-3 min-w-[120px] flex items-center justify-center"
                    onClick={generateCaptcha}
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                    ></div>
                    {/* Noise Lines */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-300 transform -rotate-3 pointer-events-none"></div>
                    <div className="absolute top-1/3 left-0 w-full h-[1px] bg-slate-300 transform rotate-2 pointer-events-none"></div>

                    <span className="font-mono text-2xl font-black text-slate-600 tracking-[0.5em] italic transform skew-x-[-10deg]">
                        {captchaCode}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-3 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <input
                type="text"
                value={userInput}
                onChange={handleChange}
                placeholder="輸入上方驗證碼"
                maxLength={5}
                className={`w-full px-5 py-3 bg-white border rounded-2xl font-bold tracking-widest uppercase transition-all outline-none ${isVerified
                    ? 'border-emerald-500 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400'
                    }`}
            />
            {userInput.length > 0 && !isVerified && userInput.length >= 5 && (
                <p className="text-base text-rose-500 font-bold ml-2">驗證碼錯誤</p>
            )}
        </div>
    );
};
