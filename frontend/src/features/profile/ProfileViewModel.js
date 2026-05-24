import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

export function useProfileViewModel() {

    const { user } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState("profile");

    

    const [form, setForm] = useState({
        name: user?.name || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // validation
        if (form.password || form.confirmPassword) {
            if (form.password !== form.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
        }

        try {
            const payload = {
                name: form.name,
                lastName: form.lastName,
                password: form.password || undefined
            };

            await api.put("/myuser/profile", payload);

            alert("Profile updated!");

        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/auth";
            }
        }
    };

    const [orders, setOrders] = useState([]);
    const [ordersLoaded, setOrdersLoaded] = useState(false);

    const loadOrders = async () => {

        if (ordersLoaded) return; // prevent spam calls

        try {
            const res = await api.get("/orders");

            setOrders(res.data?.data || []);
            setOrdersLoaded(true);

        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/auth";
            }
        }
    };


    return {
        user,
        form,
        activeTab,
        setActiveTab,
        handleChange,
        handleSave,
        orders,
        loadOrders
    };
}