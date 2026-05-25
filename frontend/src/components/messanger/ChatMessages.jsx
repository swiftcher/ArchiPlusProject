import "./chatMessages.css";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ChatMessages({ messages }) {
    const { user } = useContext(AuthContext);
    
    const containerRef = useRef(null);

useEffect(() => {

    if (!containerRef.current) return;

    containerRef.current.scrollTop =
        containerRef.current.scrollHeight;

}, [messages]);

    return (
        <div className="chat-messages-container" ref={containerRef}>

            {messages.map((message) => {

                const isMine =
                    message.sender_id === user?.id;

                return (
                    <div
                        key={message.id}
                        className={
                            isMine
                                ? "message-row mine"
                                : "message-row"
                        }
                    >

                        <div className="message-bubble">
                            {message.content}
                        </div>

                        <div className="message-time">
                            {message.created_at
                                ? new Date(message.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                                : ""
                            }
                        </div>

                    </div>
                );
            })}
        
        </div>
        
    );
}