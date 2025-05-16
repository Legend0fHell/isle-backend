'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        firstName: "Jane",
        lastName: "Smitherton",
        email: "email@janesfakedomain.net",
        message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

    return (
        <div>
            <Navbar />

            {/* Contact Us */}
            < section>
                <span className="relative top-[80px] left-[90px] text-black w-[1282px] h-[77px]"
                    style={{ fontSize: "64px", fontWeight: 700 }}>
                    Contact Us
                </span>
                <div className="relative top-[100px] left-[90px] max-w-[626px] w-full p-4 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-base font-normal">
                                    First name
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="h-12 border-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-base font-normal">
                                    Last name
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="h-12 border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-normal">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="h-12 border-gray-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-base font-normal">
                                Your message
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Enter your question or message"
                                value={formData.message}
                                onChange={handleChange}
                                className="min-h-[150px] border-gray-300"
                            />
                        </div>

                        <button type="submit" className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-lg">
                            Submit
                        </button>
                    </form>
                </div>
            </section >

            <div className="absolute top-[1089px] left-[0px]">
                <Footer />
            </div>
        </div>
    );
};

export default ContactPage;