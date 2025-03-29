"use client"
import { createContext, useEffect, useState } from 'react';

let cartContext = createContext();

export default function CartContext({ children }) {
    let oldCartData = JSON.parse(localStorage.getItem("CART")) ?? [];
    let [cart, setcart] = useState(oldCartData)

    let obj = {
        cart,
        setcart
    }
    useEffect(() => {
        if (cart) localStorage.setItem("CART", JSON.stringify(cart))
    }, [cart])


    return (
        <cartContext.Provider value={obj}>
            {children}
        </cartContext.Provider>

    )
}
export { cartContext }