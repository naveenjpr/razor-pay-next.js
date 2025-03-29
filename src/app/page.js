"use client"
import { FaShoppingCart } from "react-icons/fa";  // Import Cart Icon
import { useContext, useEffect, useState } from "react";
import { cartContext } from "./Context/CartContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast Styles

export default function Home() {
  let { cart, setcart } = useContext(cartContext);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("https://dummyjson.com/products")
      .then(response => {
        console.log("Data Fetched:", response.data.products);
        setProducts(response.data.products);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);


  let addTocart = (pdata) => {
    let { thumbnail, brand, title, price, id } = pdata
    let productObj = {
      qty: 1,
      thumbnail,
      brand,
      title,
      price,
      id
    }
    var finalData
    let filterData = cart.filter((data) => data.id == id)

    if (filterData.length == 0) {
      let finalData = [...cart, productObj]
      setcart(finalData)
      toast.success("Product added to cart", {
        autoClose: 100, // 1 सेकंड बाद बंद हो जाएगा
      });
    }


    else {
      finalData = cart.filter((data) => {
        if (data.id == id) {
          data['qty'] = data['qty'] + 1
        }
        return data
      })
      setcart(finalData)
      toast.success(title + " Product Qty Update in Cart ")
    }
  }
  return (
    <>

      <div className="text-center p-10">
        <h1 className="font-bold text-4xl mb-4">Responsive Product card grid</h1>
        <h1 className="text-3xl">Tailwind CSS</h1>
      </div>

      <div className="max-w-[95%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover mb-2" />
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <h2 className="text-lg font-semibold text-[red]">Brand: {product.brand}</h2>
              <div className="flex justify-between">
                <p className="text-gray-700">${product.price}</p>
                <FaShoppingCart className="mr-2 cursor-pointer" size={20} onClick={() => addTocart(product)} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading products...</p>
        )}
      </div>
    </>
  );
}
