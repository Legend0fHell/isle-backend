import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ClientOnly from "./client-only"
import CourseStack from "./page-client"

const DashboardPage = () => {
    return (
        <div className="relative min-h-screen">
            <Navbar />
            <div className="container mx-auto py-20 px-4">
                <h2 className="text-4xl font-bold mb-12 text-center"
                    style={{ fontWeight: 700 }}>
                    MY COURSES</h2>
                <ClientOnly>
                    <CourseStack />
                </ClientOnly>
            </div>

            <div className="absolute top-[1893px] left-[0px] w-full">
                <Footer />
            </div>
        </div>
    )
}

export default DashboardPage
