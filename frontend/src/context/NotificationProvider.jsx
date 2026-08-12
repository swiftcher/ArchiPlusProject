import { useState } from "react";

import { NotificationContext } from "./NotificationContext";

import Notification from "../components/Notification/Notification";


export default function NotificationProvider({ children }) {


    const [notification, setNotification] = useState(null);



    const showNotification = (
        message,
        type = "success"
    ) => {


        setNotification({

            message,

            type

        });



        setTimeout(() => {

            setNotification(null);

        }, 3000);


    };



    const hideNotification = () => {

        setNotification(null);

    };



    return (

        <NotificationContext.Provider
            value={{
                showNotification,
                hideNotification
            }}
        >


            {children}



            {
                notification &&

                <Notification

                    message={notification.message}

                    type={notification.type}

                    onClose={hideNotification}

                />

            }


        </NotificationContext.Provider>

    );

}