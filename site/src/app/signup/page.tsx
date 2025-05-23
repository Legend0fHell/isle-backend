"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { register, User } from 'models/user';

// Define a signup credentials interface
interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

const SignupPage = () => {
    const [userData, setUserData] = useState<SignupCredentials>({
        name: '',
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
        if (!userData.name || !userData.email || !userData.password) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        try {
            // Create a User object with the required fields
            const userToRegister: Partial<User> = {
                name: userData.name,
                email: userData.email
            };
            
            // Call register with user object and password separately
            const newUser = await register(userToRegister as User, userData.password);
            console.log('Registration successful:', newUser);

            // Redirect to login page
            window.location.href = '/login';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
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
                    <div className="absolute top-[100px] left-[0px] w-[495px] h-[219px]">
                        {/* Name Input */}
                        <span className="absolute top-[0px] left-[10px] text-black w-[50px] h-[19px]"
                            style={{ fontSize: "16px", fontWeight: 400 }}>
                            Name
                        </span>
                        <input
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            className="absolute top-[28px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                            placeholder="Enter your name"
                            type="text"
                            required
                        />
                        <div className="absolute top-[51px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />

                        {/* Email Input */}
                        <span className="absolute top-[84px] left-[10px] text-black w-[50px] h-[19px]"
                            style={{ fontSize: "16px", fontWeight: 400 }}>
                            Email
                        </span>
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
                        <span className="absolute top-[168px] left-[10px] text-black w-[80px] h-[19px]"
                            style={{ fontSize: "16px", fontWeight: 400 }}>
                            Password
                        </span>
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

                    {error && (
                        <div className="absolute top-[330px] left-[0px] w-[495px] text-center text-red-500" style={{ fontSize: "14px" }}>
                            {error}
                        </div>
                    )}

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
        </div>
    );
}

export default SignupPage;