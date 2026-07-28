import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function CustomerRoute({children}) {

    const { user } = useContext(AuthContext);


    if (!user) {
        return <Navigate to="/auth" />;
    }


    if (user.role === "admin") {
        return <Navigate to="/admin" />;
    }


    return children;
}