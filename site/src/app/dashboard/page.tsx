import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ClientOnly from "./client-only"
import { CourseStacks } from "./page-client"

const DashboardPage = () => {
    return (
        <div className="relative min-h-screen">
            <Navbar />
            <div className="relative w-full h-[566px]">
                <Image
                    className="absolute top-[0px] left-0 w-full"
                    src={"/ISLE Dashboard.png"}
                    alt="Dashboard"
                    fill={true}
                    priority
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                />
                <div className="absolute top-[0px] left-[0px] w-full h-[566px] bg-[rgba(0,0,0,0.7)]" />

                <span
                    className="absolute top-[233px] left-1/2 -translate-x-1/2 text-white text-center"
                    style={{ fontSize: "64px", fontWeight: 700 }}
                >
                    DASHBOARD
                </span>
            </div>

            <div className="container mx-auto py-20 px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">My Courses</h2>
                <ClientOnly>
                    <CourseStacks />
                </ClientOnly>
            </div>

            <div className="absolute top-[1893px] left-[0px] w-full">
                <Footer />
            </div>
        </div>
    )
}

export default DashboardPage
