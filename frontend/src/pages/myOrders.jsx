import { useEffect, useState } from "react";
import apiPrivate from "../api/apiPrivate";


import Order_Carousel from "../components/OrderStackFolder/Order_Carousel";


const getOrders = async () => {
    const token = localStorage.getItem("token");

    // 1. no token check
    if (!token || token === "undefined" || token === "null") {
        localStorage.removeItem("token");
        window.location.href = "/auth";
        return [];
    }

    try {
        const res = await apiPrivate.get("/orders");

        console.log(res.data);

        // 2. expired / invalid token
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "/auth";
            return [];
        }

        const data = await res.json();
        return data?.data || [];

    } catch (err) {
        console.error(err);
        return [];
    }
};

export default function CartPage() {
    
    const [Orders, setOrders] = useState([]);

    useEffect(() => {
        const loadOrders = async () => {
            const data = await getOrders();
            setOrders(data);
        };

        loadOrders();
    }, []);

    return (
        <div>

            <Order_Carousel orders={Orders} />

        </div>
    );
}


