'use client';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 md:px-8 py-24 md:py-28 max-w-7xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-black">
                    About Us
                </h1>
                
                {/* Team Member Cards */}
                <div className="flex flex-col space-y-20">
                    {/* First Team Member */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
                                Pham Nhat Quang
                            </h2>
                            <p className="text-lg md:text-xl mb-6 text-black opacity-60">
                                Job: Leader, AI researcher, ML & Database backend developer
                            </p>
                            <p className="text-lg md:text-xl mb-4 text-black opacity-60">
                                - Github:
                            </p>
                            <p className="text-lg md:text-xl mb-6 text-black opacity-60">
                                - Facebook:
                            </p>
                            <div className="text-lg md:text-xl text-black">
                                <p className="font-normal">Description: </p>
                                <p>Welcome to my intro page. I&apos;m currently an university student, majoring in Artificial Intelligence. I also do Competitive Programming, making (award-winning) projects, and random hobby stuff.</p>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center lg:justify-end">
                            <Image
                                src="/Pham Nhat Quang.jpg"
                                alt="Pham Nhat Quang"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Second Team Member */}
                    <div className="flex flex-col lg:flex-row-reverse gap-8">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
                                Bui Minh Quan
                            </h2>
                            <p className="text-lg md:text-xl mb-6 text-black opacity-60">
                                Job: AI researcher, Database & Backend developer
                            </p>
                            <p className="text-lg md:text-xl mb-4 text-black opacity-60">
                                - Github:
                            </p>
                            <p className="text-lg md:text-xl mb-6 text-black opacity-60">
                                - Facebook:
                            </p>
                            <div className="text-lg md:text-xl text-black">
                                <p className="font-normal">Description: </p>
                                <p>I&apos;m Bui Minh Quan, a student at the University of Engineer and Technology, VNU. I am currently working on AI development and back-end development. I have a passion for learning new technologies and applying them to real-world problems.</p>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center lg:justify-start">
                            <Image
                                src="/Bui Minh Quan.jpg"
                                alt="Bui Minh Quan"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Third Team Member */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
                                Phan Quang Truong
                            </h2>
                            <p className="text-lg md:text-xl mb-6 text-black opacity-60">
                                Job: FE Developer, Document & Report writer
                            </p>
                            <p className="text-lg md:text-xl mb-4 text-black opacity-60">
                                - Github:
                            </p>
                            <p className="text-lg md:text-xl mb-6 text-black opacity-60">
                                - Facebook:
                            </p>
                            <div className="text-lg md:text-xl text-black">
                                <p className="font-normal">Description: </p>
                                <p>Hello, guys! Phan Quang Truong here. Right now, I&apos;m a student at the University of Engineer and Technology, VNU. I am currently working on front-end development and merging with back-end. I love AI and web development, and I am always looking for new challenges to improve my skills and also vibe coding too.</p>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center lg:justify-end">
                            <Image
                                src="/Phan Quang Truong.jpg"
                                alt="Phan Quang Truong"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default AboutPage;
