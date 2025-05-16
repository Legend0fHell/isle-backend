import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const LoginPage = () => {
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

                <div className="absolute top-[90px] left-[0px] w-[495px] h-[135px]">
                    <span className="absolute top-[0px] left-[10px] text-black w-[50px] h-[19px]"
                        style={{ fontSize: "16px", fontWeight: 400 }}>
                        Email
                    </span>
                    <input className="absolute top-[28px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                        placeholder="example@gmail.com" />
                    <div className="absolute top-[51px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />

                    <span className="absolute top-[84px] left-[10px] text-black w-[50px] h-[19px]"
                        style={{ fontSize: "16px", fontWeight: 400 }}>
                        Password
                    </span>
                    <input className="absolute top-[112px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                        placeholder="* * * * * *" />
                    <div className="absolute top-[135px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />
                </div>

                <button className="absolute top-[257px] left-[137.5px] w-[220px] h-[45px] bg-[#000000] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.3)]"
                    style={{ fontSize: "16px", fontWeight: 400 }}>
                    <Link href='/dashboard'>Sign In</Link>
                </button>

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