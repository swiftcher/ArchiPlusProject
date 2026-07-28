import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminRoute({ children }) {

    const { user } = useContext(AuthContext);

    // Not logged in
    if (!user) {
        return <Navigate to="/auth" />;
    }

    // Logged in but not admin
    if (user.role !== "admin") {
        return <Navigate to="/home" />;
    }

    // Admin allowed
    return children;
}