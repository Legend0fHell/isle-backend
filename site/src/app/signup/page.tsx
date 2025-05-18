"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { signUp, UserCreate } from 'models/auth';

const SignupPage = () => {
    const [userData, setUserData] = useState<UserCreate>({
        user_name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!userData.user_name || !userData.email || !userData.password) {
            setError('Vui lòng điền đầy đủ thông tin');
            setIsLoading(false);
            return;
        }

        try {
            const newUser = await signUp(userData);
            // Xử lý sau khi đăng ký thành công
            console.log('Đăng ký thành công:', newUser);

            // Chuyển hướng đến trang login
            window.location.href = '/login';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="relative w-[1440px] bg-[#FFFFFF]">
            <Image className='absolute top-[0px] left-0 h-screen'
                src={'/Log In or Sign Up.png'}
                alt="Log In or Sign Up"
                width={682}
                height={800}
            />
            <div className="absolute top-[175px] left-[815px]">
                <span className="absolute top-[0px] left-[103px] text-black w-[289px] h-[58px]"
                    style={{ fontSize: "48px", fontWeight: 700 }}>
                    Get Started.
                </span>

                <form onSubmit={handleSubmit}>
                    <span className="absolute top-[0px] left-[103px] text-black w-[289px] h-[58px]"
                        style={{ fontSize: "48px", fontWeight: 700 }}>
                        Get Started.
                    </span>

                    <div className="absolute top-[100px] left-[0px] w-[495px] h-[219px]">
                        {/* Name Input */}
                        <input
                            value={userData.user_name}
                            onChange={(e) => setUserData({ ...userData, user_name: e.target.value })}
                            className="absolute top-[28px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                            placeholder="Enter your name"
                            type="text"
                            required
                        />
                        <div className="absolute top-[51px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />

                        {/* Email Input */}
                        <input
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            className="absolute top-[112px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                            placeholder="example@gmail.com"
                            type="email"
                            required
                        />
                        <div className="absolute top-[135px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />

                        {/* Password Input */}
                        <input
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            className="absolute top-[196px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                            placeholder="* * * * * *"
                            type="password"
                            required
                        />
                        <div className="absolute top-[219px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute top-[352px] left-[137px] w-[220px] h-[45px] bg-[#000000] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.3)] disabled:opacity-50"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                    >
                        {isLoading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>

                <div className="absolute top-[420px] left-[120px] w-[495px] h-[19px] gap-[5px] flex">
                    <span className='opacity-50' style={{ fontSize: "16px", fontWeight: 400 }}>
                        Already have an account?
                    </span>
                    <Link className="text-[#15186D] hover-black" href="/login"
                        style={{ fontSize: "16px", fontWeight: 600 }}>
                        Log In
                    </Link>
                </div>
            </div>
        </div >
    );
}

export default SignupPage;