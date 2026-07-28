  import apiPrivate from "../../api/apiPrivate";
  import { useState } from "react";

  export function useOrderViewModel() {

    const [details, setdetails] = useState(null);

    const loadOrderDetails = async (idtoget) => {
console.log(idtoget, typeof idtoget);
        try {
            const res = await apiPrivate.get(`/orders/orderDetails/${idtoget}`);
            
            setdetails(res.data?.data || []);
            

        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/auth";
            }
        }
    };

     return {
        loadOrderDetails,
        details
       
    };

  }
 