import { useState } from "react";
import apiPrivate from "../api/apiPrivate";

export function useAdminDashboardViewModel() {
    const [stats, setStats] = useState(null);
    const [details, setDetails] = useState(null);

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    /*
    ============================================================
    INITIAL / OVERALL DASHBOARD LOAD
    ============================================================
    */

    const loadDashboard = async (from = "", to = "") => {
        setLoading(true);

        try {
            /*
            ====================================================
            IMPORTANT:
            STATS ARE ALWAYS LOADED WITHOUT DATES
            ====================================================
            */

            const statsRes = await apiPrivate.get(
                "/admin/reports/dashboard"
            );

            const detailsRes = await apiPrivate.get(
                "/admin/reports/dashboard/details"
            );

            /*
            ====================================================
            ORDERS
            Dates are ONLY used for the table.
            ====================================================
            */

            const ordersRes = await apiPrivate.get(
                "/admin/orders",
                {
                    params: {
                        from: from || undefined,
                        to: to || undefined
                    }
                }
            );

            /*
            ====================================================
            PRODUCTS
            Always load all products.
            ====================================================
            */

            const productsRes = await apiPrivate.get(
                "/admin/products"
            );

            /*
            ====================================================
            SET OVERALL DASHBOARD DATA
            ====================================================
            */

            setStats(
                statsRes.data?.data || null
            );

            setDetails(
                detailsRes.data?.data || null
            );

            /*
            ====================================================
            SET TABLE DATA
            ====================================================
            */

            setOrders(
                ordersRes.data?.data || []
            );

            setProducts(
                productsRes.data?.data || []
            );

        } catch (err) {
            console.error(
                "Dashboard error:",
                err
            );

            if (err.response?.status === 401) {
                localStorage.removeItem("token");

                window.location.href = "/auth";
            }

        } finally {
            setLoading(false);
        }
    };


    return {
        stats,
        details,

        orders,
        products,

        loading,

        loadDashboard
    };
}