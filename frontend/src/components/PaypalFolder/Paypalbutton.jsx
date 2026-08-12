import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import apiPrivate from "../../api/apiPrivate";

export default function PayPalButton({ O_ID, onSuccess }) {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: "vertical",
        }}
        createOrder={async () => {
          try {
            console.log("Creating PayPal order for:", O_ID);

            const response = await apiPrivate.post("/paypal/create-order", {
              O_ID,
            });

            console.log("PayPal create-order response:", response.data);

            const paypalOrderID = response.data?.paypalOrderID;

            if (!paypalOrderID) {
              throw new Error("PayPal Order ID was not returned");
            }

            return paypalOrderID;
          } catch (error) {
            console.error("PayPal create order error:", error);

            throw error;
          }
        }}
        onApprove={async (data) => {
          try {
            console.log("PayPal approved:", data);

            const response = await apiPrivate.post("/paypal/capture-order", {
              O_ID,
              paypalOrderID: data.orderID,
            });

            console.log("PayPal capture response:", response.data);

            if (response.data?.success) {
              onSuccess?.(response.data);
            }
          } catch (error) {
            console.error("PayPal capture error:", error);

            alert("Payment could not be completed.");
          }
        }}
        onCancel={() => {
          console.log("PayPal payment cancelled");
        }}
        onError={(error) => {
          console.error("PayPal error:", error);

          alert("There was a problem with PayPal.");
        }}
      />
    </PayPalScriptProvider>
  );
}
