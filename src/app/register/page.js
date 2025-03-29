"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Register() {
    const router = useRouter(); // ✅ useRouter() को Client Component में उपयोग करें

    const [formSubmit, setformSubmit] = useState(false)
    const handleRegister = (e) => {
        e.preventDefault();
        var data = {
            name: e.target.name.value, // ✔️ सही 
            email: e.target.email.value, // ✔️ सही
            mobile_number: e.target.mobile_number.value,// ✔️ सही
            password: e.target.password.value, // ✔️ सही
        };
        axios.post("http://localhost:5000/api/frontend/users/register", data).then((result) => {
            console.log(result.data)
            if (result.data.status == true) {
                setformSubmit(true)
                toast.success(result.data.message)
                router.push("/login"); // ✅ अगर टोकन है तो Redirect करें

            }
            else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || "Registration failed!");
        })

    };
    useEffect(() => {

    }, [formSubmit])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">रजिस्टर करें</h2>
                <form onSubmit={handleRegister}>

                    {/* Name Input */}
                    <input
                        type="text"
                        placeholder="नाम"
                        className="w-full p-2 border rounded mb-4"
                        name="name"
                        required
                    />

                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="ईमेल"
                        className="w-full p-2 border rounded mb-4"
                        name="email"

                        required
                    />

                    {/* Mobile Input */}
                    <input
                        type="tel"
                        placeholder="मोबाइल नंबर"
                        className="w-full p-2 border rounded mb-4"
                        name="mobile_number"

                        required
                    />

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="पासवर्ड"
                        className="w-full p-2 border rounded mb-4"
                        name="password"
                        required
                    />

                    {/* Register Button */}
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        register                    </button>
                </form>
            </div>
        </div>
    );
}
