import { useState } from "react";
import apiPrivate from "../api/apiPrivate";


export function useAdminDashboardViewModel() {


    const [stats, setStats] = useState(null);

    const [details, setDetails] = useState(null);

    const [recentOrders, setRecentOrders] = useState([]);



    const loadDashboard = async () => {


        try {


            const statsRes = await apiPrivate.get(
                "/admin/reports/dashboard"
            );


            const detailsRes = await apiPrivate.get(
                "/admin/reports/dashboard/details"
            );


            const ordersRes = await apiPrivate.get(
                "/admin/reports/dashboard/recent-orders"
            );



            setStats(
                statsRes.data?.data
            );


            setDetails(
                detailsRes.data?.data
            );


            setRecentOrders(
                ordersRes.data?.data || []
            );



        } catch(err) {


            console.error(
                "Dashboard error:",
                err
            );


            if(err.response?.status === 401){

                localStorage.removeItem("token");
                window.location.href="/auth";

            }

        }

    };



    return {

        stats,
        details,
        recentOrders,
        loadDashboard

    };


}