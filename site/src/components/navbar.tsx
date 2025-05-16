import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <header className="w-full h-[164px] bg-[#F7F7F7] sticky top-0 z-30">

            <div className="relative w-full h-full max-w-[1440px] mx-auto px-[50px]">
                <div
                    className="absolute left-[80px] top-[52px]"
                    style={{ width: '98px', height: '60px' }}
                >
                    <span className="font-[Monotes] text-[40px] leading-[150%] text-black block"
                        style={{ letterSpacing: '0.2rem' }}>
                        ISLE
                    </span>
                </div>

                <div className="absolute left-[1003px] top-[56px] horizontal-layout"
                    style={{ width: '357px', height: '52px' }}>
                    <nav className="flex items-center gap-[48px]">
                        {/* About Us */}
                        <Link href="/about" className="text-gray-700 hover:text-black py-[11px] w-fit">
                            About Us
                        </Link>

                        {/* Contact */}
                        <Link href="#" className="text-gray-700 hover:text-black py-[11px] w-fit">
                            Contact
                        </Link>

                        {/* Login Button */}
                        <button className="bg-black hover:bg-[#F7F7F7] text-white hover:text-black rounded-lg shadow-md px-6 h-[52px] w-fit transition-all">
                            <Link href="/login">
                                Sign In
                            </Link>
                        </button>
                    </nav>
                </div>
            </div>
        </header >
    )
};

export default Navbar;