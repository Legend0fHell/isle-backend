import Image from "next/image";
import '@fontsource/inter'
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Intro */}
      <section className="relative top-[80px] left-[90px] w-[874px] h-[289px] gap-[40px] horizontal-layout align-top align-left">
        <div className="absolute top-[0px] left-[0px] w-[874px] h-[173px] vertical-layout align-top-left gap-[24px]">
          <span className="absolute top-[0px] left-[0px] w-[874px] h-[77px] text-[64px] text-black align-left align-top font-bold"
            style={{ fontWeight: 800, letterSpacing: '-2%' }}>
            Homepage
          </span>
          <span className="absolute top-[110px] left-[0px] w-[874px] h-[72px] text-[24px] text-black align-left align-middle opacity-50">
            Hello, UETERS! This is ISLE, an advanced platform that uses AI to accurately recognize hand signs, making communication more accessible and inclusive.
          </span>
          <button className="absolute top-[213px] left-[0px] w-[180px] h-[76px] bg-black hover:bg-[#F7F7F7] text-white hover:text-black rounded-lg shadow-md px-6 transition-all text-[24px]">
            <a href="/login">
              Start Now
            </a>
          </button>
        </div>
      </section>

      <Image className="relative top-[140px] left-[90px] rounded-lg"
        src="/ISLE Introduce.png"
        alt="Intro"
        width={1280}
        height={640}
      />

      {/* Focus */}
      <section className="relative top-[260px] left-[90px] w-[1279px] h-[647px] gap-[48px]">
        <span className="absolute top-[0px] left-[0px] w-[624px] h-[58px] text-[48px] text-bold align-left align-top"
          style={{ fontWeight: 600, letterSpacing: '-2%' }}>
          We&apos;re focused on
        </span>
        <section className="absolute top-[106px] left-[0px] w-[1279px] h-[541px] gap-[32px] horizontal-layout align-left">
          <div className="absolute top-[0px] left-[0px] w-[405px] h-[541px] gap-[24px] vertical-layout align-top align-left">
            <Image className="absolute top-[0px] left-[0px] rounded-lg"
              src="/Communicating.jpg"
              alt="Focus 1"
              width={405}
              height={405}
            />
            <div className="absolute top-[425px] left-[0px] w-[381px] h-[112px] gap-[4px] vertical-layout align-left">
              <span className="absolute top-[0px] left-[0px] w-[381px] h-[36px] text-[24px] text-black align-left align-top"
                style={{ fontWeight: 500 }}>
                Communicating
              </span>
              <span className="absolute top-[40px] left-[0px] w-[381px] h-[72px] text-[24px] text-black align-left align-middle opacity-50">
                Everyone has their own way to communicate.
              </span>
            </div>
          </div>

          <div className="absolute top-[0px] left-[437px] w-[405px] h-[541px] gap-[24px] vertical-layout align-top align-left">
            <Image className="absolute top-[0px] left-[0px] rounded-lg"
              src='/Entertaining.jpg'
              alt="Focus 2"
              width={405}
              height={405}
            />
            <div className="absolute top-[425px] left-[0px] w-[381px] h-[112px] gap-[4px] vertical-layout align-left">
              <span className="absolute top-[0px] left-[0px] w-[381px] h-[36px] text-[24px] text-black align-left align-top"
                style={{ fontWeight: 500 }}>
                Entertaining
              </span>
              <span className="absolute top-[40px] left-[0px] w-[381px] h-[72px] text-[24px] text-black align-left align-middle opacity-50">
                Doing something with joy is always better, right ?
              </span>
            </div>
          </div>

          <div className="absolute top-[0px] left-[874px] w-[405px] h-[541px] gap-[24px] vertical-layout align-top align-left">
            <Image className="absolute top-[0px] left-[0px] rounded-lg"
              src="/Educating.jpg"
              alt="Focus 3"
              width={405}
              height={405}
            />
            <div className="absolute top-[425px] left-[0px] w-[381px] h-[112px] gap-[4px] vertical-layout align-left">
              <span className="absolute top-[0px] left-[0px] w-[381px] h-[36px] text-[24px] text-black align-left align-top"
                style={{ fontWeight: 500 }}>
                Educating
              </span>
              <span className="absolute top-[40px] left-[0px] w-[381px] h-[72px] text-[24px] text-black align-left align-middle opacity-50">
                People need to understand each other and be treated equally.
              </span>
            </div>
          </div>
        </section>
      </section>

      {/* Features */}
      <section className="relative top-[400px] left-[90px] w-[1361px] h-[704px] gap-[48px]">
        <div className="absolute top-[0px] w-[625px] h-[693px]">
          <span className="absolute top-[0px] left-[0px] w-[624px] h-[58px] text-[48px] text-bold align-left align-top"
            style={{ fontWeight: 600, letterSpacing: '-2%' }}>
            What can ISLE do?
          </span>

          <div className="absolute top-[133px] left-[0px] w-[516px] h-[388px]">
            <div className="absolute top-[0px] left-[0px] w-[516px] h-[188px]">
              <span className="absolute top-[0px] left-[0px] w-[515px] h-[36px] text-[24px] text-black"
                style={{ fontWeight: 500 }}>
                Detecting Mode
              </span>
              <span className="absolute top-[44px] left-[0px] w-[515px] h-[144px] text-[24px] text-black opacity-50">
                ISLE features hand sign detection for accurate and seamless recognition. Also, ISLE can convert hand signs into words and sentences.
              </span>
            </div>
            <div className="absolute top-[236px] left-[0px] w-[516px] h-[152px]">
              <span className="absolute top-[0px] left-[0px] w-[515px] h-[36px] text-[24px] text-black"
                style={{ fontWeight: 500 }}>
                Learning Mode
              </span>
              <span className="absolute top-[44px] left-[0px] w-[515px] h-[144px] text-[24px] text-black opacity-50">
                Wanna practice? Learning Mode helps users practice and improve hand sign recognition through interactive exercises.
              </span>
            </div>
          </div>

          <div className="absolute top-[633px] w-[516px] h-[388px] align-left align-down">
            <button className="absolute top-[0px] left-[0px] w-[164px] h-[60px] bg-black hover:bg-[#F7F7F7] text-white hover:text-black rounded-lg shadow-md px-6 transition-all text-[24px]">
              <a href="/login">
                Start Now
              </a>
            </button>

            <button className="absolute top-[0px] left-[172px] w-[138px] h-[60px] bg-[#E6E6E6] text-black rounded-lg shadow-md px-6 transition-all text-[24px] hover:bg-[#15186D] hover:text-white"
            >
              <a href="/signup">
                Sign Up
              </a>
            </button>
          </div>
        </div>

        <Image className="absolute top-[0px] left-[736px] rounded-lg"
          src="/ISLE Mission.png"
          alt="Features"
          width={704}
          height={704}
        />
      </section>

      {/* Feedback */}
      <section className="relative top-[530px] left-[90px] w-[1280px] h-[304px] gap-[48px]">
        <span className="absolute top-[0px] left-[0px] w-[625px] h-[58px] text-[48px] text-bold align-left align-top"
          style={{ fontWeight: 600, letterSpacing: '-2%' }}>
          User&apos;s Feedback
        </span>

        <div className="absolute top-[106px] left-[0px] w-[1280px] h-[198px] gap-[32px] horizontal-layout">
          <div className="absolute top-[0px] left-[0px] w-[405px] h-[198px] gap-[48px] vertical-layout border-2 border-gray-200 rounded-[10px]">
            <span className="absolute top-[32px] left-[32px] w-[341.33px] h-[36px] text-[24px] text-black align-left align-top"
              style={{ fontWeight: 500 }}>
              “Absolute cinema!”
            </span>

            <div className="absolute top-[116px] left-[32px] w-[170px] h-[50px]">
              <Image className="absolute top-[0px] left-[0px] rounded-full"
                src="/Phan Quang Truong.png"
                alt="User 1"
                width={45}
                height={45}
              />

              <div className="absolute top-[0px] left-[61px] w-[109px] h-[50px] align-left align-top">
                <span className="absolute top-[0px] left-[0px] w-[120px] h-[24px] text-[16px] text-black align-left align-top"
                  style={{ fontWeight: 500 }}>
                  Quang Truong
                </span>
                <span className="absolute top-[26px] left-[0px] w-[88px] h-[24px] text-[16px] text-black align-left align-top opacity-50">
                  2 days ago
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[106px] left-[437.33px] w-[1280px] h-[198px] gap-[32px] horizontal-layout">
          <div className="absolute top-[0px] left-[0px] w-[405px] h-[198px] gap-[48px] vertical-layout border-2 border-gray-200 rounded-[10px]">
            <span className="absolute top-[32px] left-[32px] w-[370px] h-[36px] text-[24px] text-black align-left align-top"
              style={{ fontWeight: 500 }}>
              “Lingang guli guli wa cha ling”
            </span>

            <div className="absolute top-[116px] left-[32px] w-[170px] h-[50px]">
              <Image className="absolute top-[0px] left-[0px] rounded-full"
                src="/Pham Nhat Quang.png"
                alt="User 2"
                width={45}
                height={45}
              />

              <div className="absolute top-[0px] left-[61px] w-[120px] h-[50px] align-left align-top">
                <span className="absolute top-[0px] left-[0px] w-[120px] h-[24px] text-[16px] text-black align-left align-top"
                  style={{ fontWeight: 500 }}>
                  Nhat Quang
                </span>
                <span className="absolute top-[26px] left-[0px] w-[88px] h-[24px] text-[16px] text-black align-left align-top opacity-50">
                  1 week ago
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[106px] left-[874.67px] w-[1280px] h-[198px] gap-[32px] horizontal-layout">
          <div className="absolute top-[0px] left-[0px] w-[405px] h-[198px] gap-[48px] vertical-layout border-2 border-gray-200 rounded-[10px]">
            <span className="absolute top-[32px] left-[32px] w-[341.33px] h-[36px] text-[24px] text-black align-left align-top"
              style={{ fontWeight: 500 }}>
              “Wi Wi Wi”
            </span>

            <div className="absolute top-[116px] left-[32px] w-[170px] h-[50px]">
              <Image className="absolute top-[0px] left-[0px] rounded-full"
                src="/Bui Minh Quan.png"
                alt="User 3"
                width={45}
                height={45}
              />

              <div className="absolute top-[0px] left-[61px] w-[109px] h-[50px] align-left align-top">
                <span className="absolute top-[0px] left-[0px] w-[120px] h-[24px] text-[16px] text-black align-left align-top"
                  style={{ fontWeight: 500 }}>
                  Minh Quan
                </span>
                <span className="absolute top-[26px] left-[0px] w-[88px] h-[24px] text-[16px] text-black align-left align-top opacity-50">
                  Last Year
                </span>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Second Footer */}
      <section className="relative top-[680px] left-[0px] w-screen h-[236px] bg-[#F7F7F7]">
        <span className="absolute top-[70px] left-[78px] w-[625px] h-[96px] text-[64px] text-bold font-[Impact]"
          style={{ fontWeight: 700, letterSpacing: '6%' }}>
          JOIN US NOW
        </span>

        <div className="absolute top-[80px] left-[885px] w-[490px] h-[76px] gap-[24px] vertical-layout align-top">
          <button className="absolute top-[0px] left-[0px] w-[134px] h-[76px] bg-black hover:bg-[#F7F7F7] text-white hover:text-black rounded-lg shadow-md px-6 transition-all text-[24px]"
          >
            <a href='login'>Sign In</a>
          </button>
          <button className="absolute top-[0px] left-[158px] w-[332px] h-[76px] bg-[#E6E6E6] text-black rounded-lg shadow-md px-6 transition-all text-[24px] hover:bg-[#15186D] hover:text-white">
            Our Github Project Link</button>
        </div>
      </section>

      {/* Footer */}
      <div className="relative top-[680px] left-[0px]">
        <Footer />
      </div >

    </div >
  );
}

