import axios from "axios";

const apipublic = axios.create({
    baseURL: "http://172.20.10.12:5000/api"
});

apipublic.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apipublic;
