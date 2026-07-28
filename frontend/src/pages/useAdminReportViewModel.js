import { useState } from "react";
import apiPrivate from "../api/apiPrivate";

export function useAdminReportsViewModel() {

    const [orders, setOrders] = useState([]);

    const [products, setProducts] = useState([]);

    const [shipping, setShipping] = useState([]);

    const [feedback, setFeedback] = useState([]);


    const loadOrdersReport = async (from, to) => {

        const res = await apiPrivate.get(
            `/admin/reports/orders/range?from=${from}&to=${to}`
        );

        setOrders(res.data.data);

    };


    const loadProductsReport = async () => {

        const res =
            await apiPrivate.get("/admin/reports/products");

        setProducts(res.data.data);

    };


    const loadShippingReport = async () => {

        const res =
            await apiPrivate.get("/admin/reports/shipping");

        setShipping(res.data.data);

    };


    const loadFeedbackReport = async () => {

        const res =
            await apiPrivate.get("/admin/reports/feedback");

        setFeedback(res.data.data);

    };


    return {

        orders,

        products,

        shipping,

        feedback,

        loadOrdersReport,

        loadProductsReport,

        loadShippingReport,

        loadFeedbackReport

    };

}