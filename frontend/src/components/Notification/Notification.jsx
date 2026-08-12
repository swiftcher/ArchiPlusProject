import { createPortal } from "react-dom";
import "./Notification.css";


export default function Notification({
    message,
    type,
    onClose
}) {


    if(!message) return null;



    return createPortal(

        <div className={`notification ${type}`}>

            <span>
                {message}
            </span>


            <button onClick={onClose}>
                ×
            </button>


        </div>,

        document.body

    );

}