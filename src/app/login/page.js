"use client"
import axios from "axios";
import { useContext, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import { LoginContext } from "../Context/MainContext";
import Link from "next/link";

export default function Login() {
    let { tokenvalue, settokenvalue } = useContext(LoginContext);
    const router = useRouter();
    const cookies = new Cookies();

    const handleLogin = (e) => {
        e.preventDefault();
        var data = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        axios.post("https://nodejs-login-register.onrender.com/api/frontend/users/login", data)
            .then((result) => {
                if (result.data.status == true) {
                    toast.success("Login successfully!");
                    cookies.set("token", result.data.token);
                    settokenvalue(result.data.token); // Update token value in context
                    router.push("/");
                } else {
                    toast.error(result.data.message || "Something went wrong.");
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Upload failed!");
                console.error(error);
            });
    };

    useEffect(() => {
        var token = cookies.get("token");
        if (token) {
            router.push("/");
        }
    }, [tokenvalue,router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Login
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                            name="email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-sm text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-500 hover:text-blue-600">
                        Register
                    </Link>
                </div>
            </div>
        </div>

    );
}