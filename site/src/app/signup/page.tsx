import Image from 'next/image';
import Link from 'next/link';

const SignupPage = () => {

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

                <div className="absolute top-[100px] left-[0px] w-[495px] h-[219px]">
                    <span className="absolute top-[0px] left-[10px] text-black w-[50px] h-[19px]"
                        style={{ fontSize: "16px", fontWeight: 400 }}>
                        Name
                    </span>
                    <input className="absolute top-[28px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                        placeholder="Enter your name" />
                    <div className="absolute top-[51px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />

                    <span className="absolute top-[84px] left-[10px] text-black w-[50px] h-[19px]"
                        style={{ fontSize: "16px", fontWeight: 400 }}>
                        Email
                    </span>
                    <input className="absolute top-[112px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                        placeholder="example@gmail.com" />
                    <div className="absolute top-[135px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />

                    <span className="absolute top-[168px] left-[10px] text-black w-[50px] h-[19px]"
                        style={{ fontSize: "16px", fontWeight: 400 }}>
                        Password
                    </span>
                    <input className="absolute top-[196px] left-[10px] w-[470px] h-[19px] text-black outline-none"
                        placeholder="* * * * * *" />
                    <div className="absolute top-[219px] left-[0px] w-[470px] h-[2px] bg-[#15186D]" />
                </div>
                <button className="absolute top-[352px] left-[137px] w-[220px] h-[45px] bg-[#000000] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.3)]"
                    style={{ fontSize: "16px", fontWeight: 400 }}>
                    <Link href="dashboard">Sign Up</Link>
                </button>

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