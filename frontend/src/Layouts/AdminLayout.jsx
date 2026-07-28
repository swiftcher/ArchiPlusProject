import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";
import AdminHeader from "../components/AdminFolder/AdminHeader";


export default function AdminLayout() {

    return (
        <div className="admin-container">


            <AdminHeader />


            <div className="admin-body">


                {/* SIDEBAR */}
                <aside className="admin-sidebar">

                    <h2 className="admin-logo">
                        ArchiPlus
                    </h2>


                    <nav>

                        <NavLink to="/admin">
                            Dashboard
                        </NavLink>


                        <NavLink to="/admin/products">
                            Products
                        </NavLink>


                        <NavLink to="/admin/orders">
                            Orders
                        </NavLink>


                        <NavLink to="/admin/users">
                            Users
                        </NavLink>


                        <NavLink to="/admin/reports">
                            Reports
                        </NavLink>


                    </nav>


                </aside>



                {/* CONTENT */}
                <main className="admin-content">

                    <Outlet />

                </main>


            </div>


        </div>
    );
}