"use client"
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Cookies } from "react-cookie";
import { LoginContext } from "../Context/MainContext";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { cartContext } from '../Context/CartContext';

export default function Navbar() {
    let { cart, setcart } = useContext(cartContext);
    let { tokenvalue, settokenvalue } = useContext(LoginContext);
    const router = useRouter();
    const cookies = new Cookies();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const token = cookies.get("token");
        if (token) {
            settokenvalue(token);
        }
    }, [settokenvalue]); // 👈 अब यह केवल `settokenvalue` पर निर्भर करेगा


    const logout = () => {
        cookies.remove("token");
        settokenvalue("");
        router.push("/login"); // ✅ लॉगआउट के बाद लॉगिन पेज पर भेजें
    };
    return (
        <nav className="bg-blue-600 p-4 shadow-md sticky top-0 z-50">
            <ToastContainer position="top-right" autoClose={1000} />

            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-2xl font-bold">
                    MyLogo
                </Link>
                <div className="flex space-x-6">
                    <Link href="/" className="text-white hover:text-gray-200">
                        Home
                    </Link>
                    {!tokenvalue ? (
                        <div>
                            <Link href="/login" className="text-white hover:text-gray-200 mx-[10px]">
                                Login
                            </Link>
                            <Link href="/register" className="text-white hover:text-gray-200 mx-[10px]">
                                Register
                            </Link>

                        </div>
                    ) : (
                        <>



                            <button onClick={logout} className="text-white hover:text-gray-200">
                                Logout
                            </button>

                            <div className='text-white hover:text-gray-200'>

                                <Link href={"/profile"}>profile
                                </Link>

                            </div>
                        </>
                    )}
                </div>
                <div className='flex'>

                    <div className='text-white hover:text-gray-200 mx-[10px] cursor-pointer '>

                        <Link href={"/cart"} >cart({cart.length})
                        </Link>
                    </div>
                </div>

            </div>
        </nav>
    );
}