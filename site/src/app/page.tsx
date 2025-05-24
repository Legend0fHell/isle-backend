import Image from "next/image";
import '@fontsource/inter'
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main content with margin-top to accommodate fixed navbar */}
      <div className="flex-grow mt-16">
        {/* Intro */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Homepage
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Hello, UETERS! This is ISLE, an advanced platform that uses AI to accurately recognize hand signs, making communication more accessible and inclusive.
            </p>
            <a href="/login" className="inline-block px-6 py-3 bg-black hover:bg-gray-200 text-white hover:text-black rounded-lg shadow-md transition-all text-lg">
              Start Now
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Image className="rounded-lg w-full"
            src="/ISLE Introduce.png"
            alt="Intro"
            width={1280}
            height={640}
            priority
          />
        </div>

        {/* Focus */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-12">
            We&apos;re focused on
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <div className="mb-4">
                <Image className="rounded-lg w-full"
                  src="/Communicating.jpg"
                  alt="Focus 1"
                  width={405}
                  height={405}
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Communicating</h3>
              <p className="text-gray-600">Everyone has their own way to communicate.</p>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <Image className="rounded-lg w-full"
                  src='/Entertaining.jpg'
                  alt="Focus 2"
                  width={405}
                  height={405}
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Entertaining</h3>
              <p className="text-gray-600">Doing something with joy is always better, right?</p>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <Image className="rounded-lg w-full"
                  src="/Educating.jpg"
                  alt="Focus 3"
                  width={405}
                  height={405}
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Educating</h3>
              <p className="text-gray-600">People need to understand each other and be treated equally.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-8">
                What can ISLE do?
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-2">Detecting Mode</h3>
                  <p className="text-gray-600">
                    ISLE features hand sign detection for accurate and seamless recognition. Also, ISLE can convert hand signs into words and sentences.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Learning Mode</h3>
                  <p className="text-gray-600">
                    Wanna practice? Learning Mode helps users practice and improve hand sign recognition through interactive exercises.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a href="/login" className="px-6 py-3 bg-black hover:bg-gray-200 text-white hover:text-black rounded-lg shadow-md transition-all">
                    Start Now
                  </a>
                  <a href="/signup" className="px-6 py-3 bg-gray-200 hover:bg-indigo-700 text-black hover:text-white rounded-lg shadow-md transition-all">
                    Sign Up
                  </a>
                </div>
              </div>
            </div>

            <div>
              <Image className="rounded-lg w-full"
                src="/ISLE Mission.png"
                alt="Features"
                width={704}
                height={704}
              />
            </div>
          </div>
        </section>

        {/* Feedback */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-8">
            User&apos;s Feedback
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <p className="text-xl font-medium mb-6">&quot;Absolute cinema!&quot;</p>
              <div className="flex items-center">
                <Image className="rounded-full mr-4"
                  src="/Phan Quang Truong.png"
                  alt="User 1"
                  width={45}
                  height={45}
                />
                <div>
                  <p className="font-medium">Quang Truong</p>
                  <p className="text-gray-500 text-sm">2 days ago</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <p className="text-xl font-medium mb-6">&quot;Lingang guli guli wa cha ling&quot;</p>
              <div className="flex items-center">
                <Image className="rounded-full mr-4"
                  src="/Pham Nhat Quang.png"
                  alt="User 2"
                  width={45}
                  height={45}
                />
                <div>
                  <p className="font-medium">Nhat Quang</p>
                  <p className="text-gray-500 text-sm">1 week ago</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <p className="text-xl font-medium mb-6">&quot;Wi Wi Wi&quot;</p>
              <div className="flex items-center">
                <Image className="rounded-full mr-4"
                  src="/Bui Minh Quan.png"
                  alt="User 3"
                  width={45}
                  height={45}
                />
                <div>
                  <p className="font-medium">Minh Quan</p>
                  <p className="text-gray-500 text-sm">Last Year</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-4xl font-bold mb-6 md:mb-0">JOIN US NOW</h2>
              <div className="flex flex-wrap gap-4">
                <a href="/login" className="px-6 py-3 bg-black hover:bg-gray-200 text-white hover:text-black rounded-lg shadow-md transition-all">
                  Sign In
                </a>
                <a href="#" className="px-6 py-3 bg-gray-200 hover:bg-indigo-700 text-black hover:text-white rounded-lg shadow-md transition-all">
                  Our Github Project Link
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

