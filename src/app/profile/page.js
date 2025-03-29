"use client"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Cookies } from "react-cookie"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function page() {
  const [userData, setUserData] = useState(null)
  const cookies = new Cookies()

  useEffect(() => {
    const userToken = cookies.get("token")
    axios
      .post(
        "https://nodejs-login-register.onrender.com/api/frontend/users/profile",
        "",
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((success) => {
        if (success.data.token_error == true) {
          cookies.remove("token")
        } else {
          console.log("User Profile:", success.data)
          setUserData(success.data.data.userData) // ✅ यूज़र डेटा को स्टेट में सेव करें
        }
      })
      .catch((error) => {
        toast.error("Something went wrong!")
        console.error("Profile Fetch Error:", error)
      })
  }, [])
  return (
    <div className="max-w-[500px] mx-auto h-screen">
      <h1 className="text-2xl font-bold text-center">My Profile</h1>

      {userData ? (
        <div className="space-y-2 text-start w-[300px] border border-[solid]">
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Mobile:</strong> {userData.mobile_number}
          </p>
          <p>
            <strong>User ID:</strong> {userData._id}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Loading profile...</p>
      )}
    </div>
  )
}
