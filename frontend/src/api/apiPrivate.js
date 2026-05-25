import axios from "axios";


import { AuthContext } from "../context/AuthContext";


const apiPrivate = axios.create({
    baseURL: "http://172.20.10.12:5000/api"
});


// 1. REQUEST interceptor (attach token)
apiPrivate.interceptors.request.use((config) => {
   
    
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
    
});


// 2. RESPONSE interceptor (handle errors like 401)
apiPrivate.interceptors.response.use(
    
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            AuthContext.logout();
            
            
        }

        return Promise.reject(error);
    }
);

export default apiPrivate;