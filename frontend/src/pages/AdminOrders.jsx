import { useEffect, useState } from "react";
import apiPrivate from "../api/apiPrivate";
import "./AdminOrders.css";


export default function AdminOrders(){

    const [orders,setOrders] = useState([]);
    const [filter,setFilter] = useState("All");


    const loadOrders = async () => {

        try {

            const res = await apiPrivate.get("/admin/orders");

            setOrders(res.data.data || []);

        } catch(err){

            console.log("LOAD ORDERS ERROR:",err);

        }

    };


    useEffect(()=>{

        const fetchData = async()=>{

            await loadOrders();

        };

        fetchData();

    },[]);



    const changeStatus = async(id,status)=>{

        try{

            await apiPrivate.put(
                `/admin/orders/${id}/status`,
                {
                    status
                }
            );

            loadOrders();

        }catch(err){

            console.log(err);

        }

    };



    const filteredOrders =
        filter==="All"
        ?
        orders
        :
        orders.filter(
            order=>order.O_Status===filter
        );



    return (

        <div className="admin-orders">


            <div className="orders-header">

                <h1>
                    Orders Management
                </h1>


                <div className="order-filters">

                    {
                        ["All","Pending","Confirmed","Completed","Declined"]
                        .map(status=>(

                            <button
                            key={status}
                            className={
                                filter===status
                                ?
                                "active"
                                :
                                ""
                            }
                            onClick={()=>setFilter(status)}
                            >
                                {status}
                            </button>

                        ))
                    }

                </div>

            </div>



            <div className="orders-grid">


            {
                filteredOrders.map(order=>(


                    <div
                    className="order-card"
                    key={order.O_ID}
                    >


                        <div className="order-top">

                            <h2>
                                Order #{order.O_ID}
                            </h2>

                            <span className="status">
                                {order.O_Status}
                            </span>

                        </div>



                        <div className="customer-info">

                            <p>
                                <b>Customer:</b>
                                {" "}
                                {order.customer.name}
                            </p>


                            <p>
                                <b>Email:</b>
                                {" "}
                                {order.customer.email}
                            </p>


                            <p>
                                <b>Date:</b>
                                {" "}
                                {new Date(order.O_Date).toLocaleString()}
                            </p>

                        </div>



                        <h3>
                            Products
                        </h3>


                        <div className="order-products">

                        {
                            order.products.map(product=>(

                                <div 
                                className="order-product"
                                key={product.id}
                                >

                                    <span>
                                        {product.name}
                                    </span>

                                    <span>
                                        x{product.quantity}
                                    </span>

                                    <span>
                                        ${product.price}
                                    </span>

                                </div>

                            ))
                        }

                        </div>



                        <h3>
                            Total: ${order.total}
                        </h3>



                        <div className="order-actions">


                        {
                            order.O_Status==="Pending" &&

                            <>
                            <button
                            onClick={()=>
                                changeStatus(
                                    order.O_ID,
                                    "Confirmed"
                                )
                            }
                            >
                                Confirm
                            </button>


                            <button
                            className="danger"
                            onClick={()=>
                                changeStatus(
                                    order.O_ID,
                                    "Declined"
                                )
                            }
                            >
                                Decline
                            </button>
                            </>

                        }



                        {
                            order.O_Status==="Confirmed" &&

                            <button
                            onClick={()=>
                                changeStatus(
                                    order.O_ID,
                                    "Completed"
                                )
                            }
                            >
                                Complete
                            </button>

                        }


                        </div>


                    </div>


                ))
            }


            </div>


        </div>

    );

}