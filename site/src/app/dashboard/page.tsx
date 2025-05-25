import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const DashboardPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative w-full h-[450px] ">
                <div className="absolute inset-0">
                    <Image 
                        src="/ISLE Dashboard.png"
                        alt="Dashboard"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-white text-8xl font-bold">DASHBOARD</h1>
                </div>
            </section>
            
            {/* Detecting Mode Section */}
            <section className="container mx-auto py-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col space-y-6 md:w-1/2">
                        <h2 className="text-4xl font-semibold">Detecting mode</h2>
                        <p className="text-2xl text-gray-500">
                            Detect and auto-correct your handsign-to-text.
                        </p>
                        <div>
                            <Link href="/detecting-mode">
                                <button className="bg-black text-white px-6 py-3 rounded-lg text-2xl hover:bg-gray-100 hover:text-black transition-colors shadow-lg">
                                    Try It Out
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="md:w-1/2">
                        <Image 
                            src="/Detecting Mode.png"
                            alt="Detecting Mode"
                            width={624}
                            height={312}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </section>
            
            {/* Learning Mode Section */}
            <section className="container mx-auto py-20">
                <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10">
                    <div className="flex flex-col space-y-6 md:w-1/2">
                        <h2 className="text-4xl font-semibold">Learning Mode</h2>
                        <p className="text-2xl text-gray-500">
                            Wanna practice? Okay, we got you. Here you are.
                        </p>
                        <div>
                            <Link href="/courses">
                                <button className="bg-black text-white px-6 py-3 rounded-lg text-2xl hover:bg-gray-100 hover:text-black transition-colors shadow-lg">
                                    Practice Now
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="md:w-1/2">
                        <Image 
                            src="/Learning Mode.png"
                            alt="Learning Mode"
                            width={624}
                            height={312}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default DashboardPage;