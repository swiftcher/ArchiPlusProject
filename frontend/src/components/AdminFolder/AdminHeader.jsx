import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminHeader.css"

export default function AdminHeader() {

    const { user, logout } = useContext(AuthContext);


    return (
        <header className="admin-header">

            <h2>
                ArchiPlus
            </h2>


            <div>

                <span>
                    {user?.name}
                </span>


                <button onClick={logout}>
                    Sign Out
                </button>

            </div>

        </header>
    );
}