import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import socket from "../pages/socket";

import ChatSidebar from "../components/messanger/ChatSidebar";
import ChatMessages from "../components/messanger/ChatMessages";
import ChatInput from "../components/messanger/ChatInput";
import api from "../api/axios";

import "./messenger.css";

export default function Messenger() {
    const { user } = useContext(AuthContext);

    const currentUserId = user.id;
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);

   

    useEffect(() => {

    if (!activeConversation) return;

    api.get(`/users/conversations/${activeConversation}`)
        .then(res => setMessages(res.data))
        .catch(err => console.log(err));

}, [activeConversation]);

    useEffect(() => {

    if (!user?.id) return;

    socket.emit("join_user", currentUserId);

}, [user]);

    // JOIN SOCKET ROOM
    useEffect(() => {
    if (!activeConversation) return;

    socket.emit("join_conversation", activeConversation);
}, [activeConversation]);

    // RECEIVE MESSAGES
    useEffect(() => {
        const handleMessage = (msg) => {
            setMessages((prev) => {
                const exists = prev.some(m => m.id === msg.id);
                if (exists) return prev;
                return [...prev, msg];
            });
        };

        socket.on("receive_message", handleMessage);

        return () => socket.off("receive_message", handleMessage);
    }, []);

        
    // SEND MESSAGE
    const sendMessage = (text) => {
    if (!text.trim()) return;

    if (!activeConversation) {
        console.log("No conversation selected");
        return;
    }

    socket.emit("send_message", {
        conversation_id: activeConversation,
        sender_id: currentUserId,
        content: text
    });
};

    

    return (
        <div className="messenger-page">
            <div className="messenger-card">

                <ChatSidebar
                    activeConversation={activeConversation}
                    setActiveConversation={setActiveConversation}
                />

                <div className="messenger-main">

                    <div className="messenger-header">
                        <div>Support Inbox</div>
                        <div>Hello, {user.name}</div>
                    </div>

                   <ChatMessages
                    messages={messages}
                    currentUserId={currentUserId}
                    />

                    <ChatInput 
                    onSend={sendMessage}
                    disabled={!activeConversation}
                />

                </div>
            </div>
        </div>
    );
}