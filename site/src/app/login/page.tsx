"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { login, UserLogin, UserRead } from 'models/auth'; // Import UserRead

const LoginPage = () => {
    const [credentials, setCredentials] = useState<UserLogin>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user: UserRead = await login(credentials); // Sử dụng UserRead
            // Lưu thông tin user với cấu trúc mới
            localStorage.setItem('user', JSON.stringify({
                id: user.user_id, // Đổi thành user_id
                name: user.user_name,
                email: user.email
            }));

            window.location.href = '/dashboard';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
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
            <div className="absolute top-[223px] left-[853px]">
                <span className="absolute top-[0px] left-[65.5px] text-black w-[364px] h-[58px]"
                    style={{ fontSize: "48px", fontWeight: 700 }}>
                    Welcome Back.
                </span>
                <form onSubmit={handleSubmit}>
                    <div className="absolute top-[90px] left-[0px] w-[495px] h-[135px]">
                        <span className="absolute top-[0px] left-[10px] text-black w-[50px] h-[19px]"
                            style={{ fontSize: "16px", fontWeight: 400 }}>
                            Email
                        </span>
                        <input
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            className="absolute top-[28px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                            placeholder="example@gmail.com"
                            type="email"
                            required />
                        <div className="absolute top-[51px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />

                        <span className="absolute top-[84px] left-[10px] text-black w-[50px] h-[19px]"
                            style={{ fontSize: "16px", fontWeight: 400 }}>
                            Password
                        </span>
                        <input
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="absolute top-[112px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                            placeholder="* * * * * *"
                            type="password"
                            required
                        />
                        <div className="absolute top-[135px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute top-[257px] left-[137.5px] w-[220px] h-[45px] bg-[#000000] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.3)] disabled:opacity-50"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                    >
                        {isLoading ? 'Loading...' : 'Sign In'}
                    </button>
                </form>

                <div className="absolute top-[324px] left-[166.5px] w-[198px] h-[19px] gap-[5px] flex">
                    <span className='opacity-50' style={{ fontSize: "16px", fontWeight: 400 }}>
                        New to ISLE?
                    </span>
                    <Link className="text-[#15186D]" href="/signup"
                        style={{ fontSize: "16px", fontWeight: 600 }}>
                        Sign Up
                    </Link>
                </div>
            </div>


        </div>
    );
}
export default LoginPage;