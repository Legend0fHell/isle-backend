import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
const DashboardPage = () => {
    return (
        <div>
            <Navbar />
            <div className="relative w-full h-[566px]">
                <Image className='absolute top-[0px] left-0 w-full'
                    src={'/ISLE Dashboard.png'}
                    alt="Dashboard"
                    fill={true}
                />
                <div className="absolute top-[0px] left-[0px] w-full h-[566px] bg-[rgba(0,0,0,0.7)]" />

                <span className="absolute top-[233px] left-[550px] text-white w-[844px] h-[90px]"
                    style={{ fontSize: "64px", fontWeight: 700 }}>
                    DASHBOARD
                </span>
            </div>

            <div className="absolute top-[926px] left-[90px] w-[516px] h-[228px] space-y-[24px]">
                <span className="absolute text-black w-[516px] h-[48px] top-[0px] left-[0px]"
                    style={{ fontSize: "40px", fontWeight: 600 }}>
                    Detecting mode
                </span>
                <span className="absolute text-black w-[516px] h-[48px] opacity-50 top-[72px] left-[0px]"
                    style={{ fontSize: "24px", fontWeight: 400 }}>
                    Detect and auto-correct your handsign-to-text.
                </span>
                <button className="absolute bg-[#000000] text-white w-[156px] h-[60px] rounded-lg top-[168px] left-[0px] hover:bg-[#F7F7F7] hover:text-black shadow-[0px_10px_20px_rgba(0,0,0,0.1)]"
                    style={{ fontSize: "24px", fontWeight: 400 }}>
                    <Link href="/detecting-mode">Try It Out</Link>
                </button>
            </div>

            <Image className='absolute top-[878px] left-[736px] rounded-lg'
                src={'/Detecting Mode.png'}
                alt="Detecting Mode"
                width={624}
                height={312}
            />

            <div className="absolute top-[1406px] left-[844px] w-[516px] h-[228px] space-y-[24px]">
                <span className="absolute text-black w-[516px] h-[48px] top-[0px] left-[0px]"
                    style={{ fontSize: "40px", fontWeight: 600 }}>
                    Learning Mode
                </span>
                <span className="absolute text-black w-[516px] h-[48px] opacity-50 top-[72px] left-[0px]"
                    style={{ fontSize: "24px", fontWeight: 400 }}>
                    Wanna practice ? Okay, we got you. Here you are.
                </span>
                <button className="absolute bg-[#000000] text-white w-[201px] h-[60px] rounded-lg top-[168px] left-[0px] hover:bg-[#F7F7F7] hover:text-black shadow-[0px_10px_20px_rgba(0,0,0,0.1)]"
                    style={{ fontSize: "24px", fontWeight: 400 }}>
                    <Link href="/courses">Practice Now</Link>
                </button>
            </div>

            <Image className='absolute top-[1363px] left-[90px] rounded-lg'
                src={'/Learning Mode.png'}
                alt="Learning Mode"
                width={624}
                height={312}
            />

            <div className="absolute top-[1893px] left-[0px]">
                <Footer />
            </div>
        </div >
    );
};

export default DashboardPage;