"use client"
import React, { useContext, useEffect, useState } from 'react';
import { cartContext } from '../Context/CartContext';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axios from 'axios';

export default function Cart() {
    let { cart, setcart } = useContext(cartContext);
    console.log("cart", cart)
    const [Totalprice, setTotalprice] = useState(0)
    const [Totaltax, setTotaltax] = useState(0)
    // const [Razorpay] = useRazorpay(); // error show razor apy
    const { error, isLoading, Razorpay } = useRazorpay(); //error soultion

    let deleteRow = (id) => {
        if (window.confirm("Are you sure want delete this???")) {
            let finalData = cart.filter((data, index) => index != id)
            setcart(finalData)
        }
    }

    useEffect(() => {
        let total = 0;

        for (let n of (cart ?? [])) {
            total = total + (n.qty * n.price)
        }
        setTotaltax(total * 5 / 100)
        setTotalprice(total)
    }, [cart])
    // Decrease the quantity of an item

    const decreaseQty = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
        );
        setcart(updatedCart);
    };
    // Increase the quantity of an item
    const increaseQty = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
        setcart(updatedCart);
    };


    const placeOrder = () => {
        if (!cart || cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }


        const userId = 1001; // Ideally, get this from the auth state

        const productDetails = cart.map((c) => ({
            productId: c.id,
            qty: c.qty,
            price: c.price,
            total: c.qty * c.price,
        }));

        // Calculate dynamic order total
        const orderSubtotal = productDetails.reduce((sum, item) => sum + item.total, 0);
        const taxAmount = orderSubtotal * 5 / 100; // 5% टैक्स
        const orderTotal = orderSubtotal + taxAmount;
        const shippingDetails = {
            address: "h.n 3583 jaipur"
        };


        let datasava = {
            user_id: userId,
            product_details: productDetails,
            order_total: orderTotal,
            shipping_details: shippingDetails
        }
        axios.post(
            "http://localhost:5000/api/frontend/orders/place-order", datasava

        ).then(
            (success) => {
                console.log(success)
                if (success.data.data.status) {
                    openPaymentPopUp(success.data.data.id, success.data.data);
                } else {
                    console.log('Unable to place order');
                }
            }
        ).catch((error) => {
            console.error("Order placement failed", error);
            alert("Failed to place order. Please try again.");
        });
    }


    const openPaymentPopUp = (order_id, razorpayOrder) => {
        const options = {
            key: "rzp_test_sN9yGpladGdVuN", // Enter the Key ID generated from the Dashboard
            amount: razorpayOrder.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Naveen ",
            description: "upskillingBharat",
            image: "https://www.wscubetech.com/images/wscube-tech-logo.svg",
            order_id: razorpayOrder.id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
            handler: function (response) {

                console.log(response)
                alert('success')
                axios.post("http://localhost:5000/api/frontend/orders/place-order",
                    { order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, status: 2 }
                ).then(
                    (success) => {
                        if (success.data.status) {
                            // navigator(`/order-summary/${success.data.order_id}/true`);
                            // dispatcher(emptyCart());
                        } else {
                            alert("Failed to confirm order.");
                        }
                    }
                ).catch((error) => {
                    console.error("Error confirming order", error);
                    alert("Something went wrong. Please try again.");
                });
            },
            prefill: {
                name: "naveen saini",
                email: "naveensainijpr@gmail.com",
                contact: "8619916687",
            },
            theme: {
                color: "#ff4252",
            },
        };



        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {

            console.error("Payment failed", response);
            alert("Payment failed. Please try again.");
            axios.post("http://localhost:5000/api/frontend/orders/confirm-order",
                { order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, status: 3 }
            ).then((success) => {
                if (success.data.status) {
                    console.log("Order marked as failed.");
                } else {
                    alert("Failed to update payment status.");
                }
            }).catch((error) => {
                console.error("Error updating payment failure", error);
                alert("Something went wrong. Please try again.");
            });

        });

        rzp1.open();
    }
    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="flex flex-col md:flex-row shadow-md my-5">
                {/* Cart Items */}
                <div className="w-full md:w-3/4 bg-white p-5 md:p-10">
                    <div className="flex justify-between border-b pb-4">
                        <h1 className="font-semibold text-lg md:text-2xl">Shopping Cart</h1>
                        <h2 className="font-semibold text-lg md:text-2xl">{cart.length} Items</h2>
                    </div>

                    {/* Table Header - Hidden on Mobile */}
                    <div className="hidden md:flex mt-6 mb-3">
                        <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                        <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Quantity</h3>
                        <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Price</h3>
                        <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
                        <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Delete</h3>
                    </div>

                    {/* Single Product */}
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center md:items-start border-b py-4 md:py-5">
                                {/* Product Image & Details */}
                                <div className="w-full md:w-2/5 flex items-center">
                                    <img className="h-16 md:h-24 w-auto rounded-md" src={item.thumbnail} alt={item.title} />
                                    <div className="ml-4">
                                        <span className="font-bold text-sm">{item.title}</span>
                                        <span className="block text-red-500 text-xs">{item.brand}</span>
                                        <button className="text-gray-500 text-xs hover:text-red-500" onClick={() => deleteRow(index)}>Remove</button>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className=" w-full md:w-1/5 flex flex-col items-center mt-2 md:mt-0">
                                    <span className="text-gray-600 text-xs uppercase mb-1">Qty</span>
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => decreaseQty(item.id)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-l-md"
                                        >
                                            −
                                        </button>
                                        <span className="px-4">{item.qty}</span>
                                        <button
                                            onClick={() => increaseQty(item.id)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-md"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>


                                {/* Price */}
                                {/* Price */}
                                <div className="w-full md:w-1/5 text-center font-semibold text-sm mt-2 md:mt-0">
                                    <span className="text-gray-700 block  ">Price:</span>
                                    <span className="ml-1 text-black block  ">${item.price.toFixed(2)}</span>
                                </div>

                                {/* Total Price (Price × Quantity) */}
                                <div className="w-full md:w-1/5 text-center font-semibold text-sm mt-2 md:mt-0">
                                    <span className="text-gray-700  block">Total:</span>
                                    <span className="ml-1 text-black  block">${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                                <div className="w-full flex justify-center md:w-1/5 text-center font-semibold text-sm mt-2 md:mt-0">
                                    <button className='table cursor-pointer  bg-[red] p-1 text-white '
                                        onClick={() => deleteRow(index)}
                                    >Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Cart is empty</p>
                    )}

                    <a href="#" className="text-indigo-600 text-sm mt-5 block text-center md:text-left">Continue Shopping</a>
                </div>

                {/* Order Summary - Place at the Bottom on Mobile */}
                <div className="w-full md:w-1/4 p-5 md:p-10 bg-gray-100 mt-5 md:mt-0">
                    <h1 className="font-semibold text-lg md:text-2xl border-b pb-4">Order Summary</h1>
                    <div className="flex justify-between mt-5">
                        <span className="font-semibold text-sm">Items {cart.length}</span>
                        <span className="font-semibold text-sm">${Totalprice.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <label className="block text-sm font-medium">Tax</label>
                        <span className="font-semibold text-sm">${Totaltax.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <label className="block text-sm font-medium">Shipping</label>
                        <span className="font-semibold text-sm">$0</span>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium">Promo Code</label>
                        <input type="text" className="block w-full p-2 border rounded-md text-sm" placeholder="Enter code" />
                        <button className="bg-red-500 w-full text-white py-2 mt-2 rounded-md">Apply</button>
                    </div>
                    <div className="border-t mt-6 pt-4">
                        <div className="flex justify-between font-semibold text-sm">
                            <span>Total Cost</span>
                            <span>${(Totalprice + Totaltax).toFixed(2)}</span>
                        </div>
                        <button className="bg-indigo-500 text-white w-full py-3 mt-4 rounded-md cursor-pointer" onClick={placeOrder}>Checkout</button>
                    </div>
                </div>
            </div>
        </div >

    );
}
