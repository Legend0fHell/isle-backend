import Image from 'next/image'

const Footer = () => {
    return (
        <footer className="relative w-[1440px] h-[264px] bg-[#FFFFFF]">
            <span className="absolute top-[66px] left-[80px] w-[98px] h-[60px] text-[40px] text-bold font-[Monotes]"
                style={{ fontWeight: 700, letterSpacing: '0.2rem' }}>
                ISLE
            </span>

            <div className="absolute top-[48px] left-[1173px] w-[187px] h-[168px] gap-[24px] vertical-layout align-top">
                <span className="absolute top-[0px] left-[0px] w-[187px] h-[24px] text-[16px] text-black align-left align-top"
                    style={{ fontWeight: 500 }}>
                    OUR WORLD
                </span>
                <span className="absolute top-[48px] left-[0px] w-[187px] h-[24px] text-[16px] text-black align-left align-top opacity-50 hover:opacity-80">
                    About Us
                </span>
                <span className="absolute top-[96px] left-[0px] w-[187px] h-[24px] text-[16px] text-black align-left align-top opacity-50 hover:opacity-80">
                    Contact
                </span>
                <span className="absolute top-[144px] left-[0px] w-[187px] h-[24px] text-[16px] text-black align-left align-top opacity-50 hover:opacity-80">
                    Github
                </span>
            </div>

            <div className="absolute top-[176px] left-[70px] w-[184px] h-[40px]">
                <Image className="absolute top-[0px] left-[0px] grayscale opacity-75"
                    src="/facebook.jpg"
                    alt="Facebook Logo"
                    width={40}
                    height={40}
                />
                <Image className="absolute top-[0px] left-[48px] grayscale opacity-65"
                    src="/linkedin.jpg"
                    alt="LinkedIn Logo"
                    width={40}
                    height={40}
                />
                <Image className="absolute top-[0px] left-[96px] opacity-50 grayscale"
                    src="/github.jpg"
                    alt="Github Logo"
                    width={35}
                    height={35}
                />
                <Image className="absolute top-[0px] left-[144px] grayscale opacity-65"
                    src="/instagram.jpg"
                    alt="Instagram Logo"
                    width={40}
                    height={40}
                />
            </div>

        </footer>
    )
}

export default Footer;