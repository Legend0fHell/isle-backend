"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/'); // Redirect to home page after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href={currentUser ? "/dashboard" : "/"} className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                ISLE
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/courses" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Courses
                            </Link>
                            <Link href="/detecting-mode" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Detecting Mode
                            </Link>
                            <Link href="/about" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                About
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {currentUser ? (
                            <div className="relative flex items-center gap-4">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {currentUser.name || 'User'}
                                </span>
                                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-semibold">
                                    {(currentUser.name?.charAt(0) || 'U').toUpperCase()}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/login" className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    Log In
                                </Link>
                                <Link href="/signup" className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                            {/* Icon when menu is closed */}
                            {!isMobileMenuOpen && (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                            {/* Icon when menu is open */}
                            {isMobileMenuOpen && (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link href="/courses" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
                        Courses
                    </Link>
                    <Link href="/detecting-mode" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
                        Detecting Mode
                    </Link>
                    <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
                        About
                    </Link>
                    {currentUser ? (
                        <button
                            onClick={handleLogout}
                            className="w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
                                Log In
                            </Link>
                            <Link href="/register" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;