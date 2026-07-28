import { useEffect } from "react";
import "./AdminDashboard.css";

import { useAdminDashboardViewModel } from "./useAdminViewModel";



export default function AdminDashboard(){


    const {
        stats,
        details,
        recentOrders,
        loadDashboard

    } = useAdminDashboardViewModel();



    useEffect(()=>{

        loadDashboard();

    },[]);




    return (

        <div className="admin-dashboard">


            <h1>
                Admin Dashboard
            </h1>


            <p>
                Welcome to ArchiPlus administration
            </p>



            <div className="admin-cards">


                <div className="admin-card">

                    <h3>
                        Users
                    </h3>

                    <p>
                        {stats?.users ?? 0}
                    </p>

                </div>



                <div className="admin-card">

                    <h3>
                        Products
                    </h3>

                    <p>
                        {stats?.products ?? 0}
                    </p>

                </div>



                <div className="admin-card">

                    <h3>
                        Orders
                    </h3>

                    <p>
                        {stats?.orders ?? 0}
                    </p>

                </div>



                <div className="admin-card">

                    <h3>
                        Revenue
                    </h3>

                    <p>
                        ${stats?.revenue ?? 0}
                    </p>

                </div>



                <div className="admin-card">

                    <h3>
                        Pending Orders
                    </h3>

                    <p>
                        {details?.pendingOrders ?? 0}
                    </p>

                </div>



                <div className="admin-card">

                    <h3>
                        Completed Orders
                    </h3>

                    <p>
                        {details?.completedOrders ?? 0}
                    </p>

                </div>



                <div className="admin-card">

                    <h3>
                        Low Stock
                    </h3>

                    <p>
                        {details?.lowStockProducts ?? 0}
                    </p>

                </div>



            </div>




            <div className="recent-orders">


                <h2>
                    Recent Orders
                </h2>



                {
                    recentOrders.map(order=>(

                        <div 
                        className="order-row"
                        key={order.O_ID}
                        >

                            <span>
                                #{order.O_ID}
                            </span>


                            <span>
                                {order.U_Name} {order.U_LastName}
                            </span>


                           <span className={`status ${order.O_Status.toLowerCase()}`}>
                            {order.O_Status}
                           </span>


                            <span>
                                {
                                new Date(order.O_Date)
                                .toLocaleDateString()
                                }
                            </span>


                            <span>
                                ${order.Total}
                            </span>


                        </div>

                    ))
                }



            </div>



        </div>

    );


}