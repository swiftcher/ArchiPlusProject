import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminRoute({ children }) {

    const { user } = useContext(AuthContext);

    // Not logged in
    if (!user) {
        return <Navigate to="/home" />;
    }

    // Logged in but not admin
    else if (user.role !== "admin") {
        return <Navigate to="/home" />;
    }

    // Admin allowed
    return children;
}