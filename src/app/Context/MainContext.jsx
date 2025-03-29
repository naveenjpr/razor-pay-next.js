"use client"
import React, { createContext, useState, useEffect } from 'react'
import { Cookies } from 'react-cookie'

let LoginContext = createContext();

export default function MainContext({ children }) {
    const cookies = new Cookies();
    const [tokenvalue, settokenvalue] = useState(cookies.get("token") ?? "");

    useEffect(() => {
        const token = cookies.get("token");
        if (token) {
            settokenvalue(token);
        }
    }, []); // 👈 अब यह केवल माउंट होने पर ही चलेगा


    return (
        <LoginContext.Provider value={{ tokenvalue, settokenvalue }}>
            {children}
        </LoginContext.Provider>
    );
}

export { LoginContext }; 