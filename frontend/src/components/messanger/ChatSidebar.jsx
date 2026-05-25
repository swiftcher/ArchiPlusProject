import { useEffect, useState,useContext } from "react";

import apiPrivate from "../../api/apiPrivate";
import socket from "../../pages/socket";

  import { AuthContext } from "../../context/AuthContext";


export default function ChatSidebar({
    activeConversation,
    setActiveConversation,
    
}) {
    const {  user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);

    useEffect(() => {
    if (!user.id) return;

    apiPrivate.get("/users/conversations")
    .then(res => {
        console.log("CONVOS:", res.data);
        setChats(res.data);
    })

}, [user.id]);

useEffect(() => {

    const handleConversationUpdate = (data) => {

        setChats((prev) => {

            const exists = prev.find(c => c.convo_id === data.convo_id);

            // NEW CONVERSATION
            if (!exists) {
                return [
                    {
                        convo_id: data.convo_id,
                        title: data.title,
                        last_message_time: data.last_message_time
                    },
                    ...prev
                ];
            }

            // UPDATE EXISTING
            const updated = prev.map(c =>
                c.convo_id === data.convo_id
                    ? {
                        ...c,
                        last_message_time: data.last_message_time
                    }
                    : c
            );

            // MOVE TO TOP
            return updated.sort((a, b) =>
                b.convo_id === data.convo_id ? 1 : 0
            );
        });
    };

    socket.on("conversation_updated", handleConversationUpdate);

    return () => {
        socket.off("conversation_updated", handleConversationUpdate);
    };

}, []);

    

const startSupportChat = async () => {
    try {
        const res = await apiPrivate.post("/users/conversations/create-or-get");

        setActiveConversation(res.data.convo_id);

    } catch (err) {
        console.log("create-or-get error:", err);
    }
};

const startnewconvo = async () => {
    try {
        const res = await apiPrivate.post("/users/conversations/create",{title: new Date().toLocaleTimeString()});

        setActiveConversation(res.data.convo_id);

    } catch (err) {
        console.log("create-or-get error:", err);
    }
};

    return (
        <div>
            <h3>Conversations</h3>
            <button onClick={startSupportChat}>
            💬 Contact Support
            </button>
            <button onClick={startnewconvo}>
            💬 start new convo
            </button>

            {chats.map(chat => (
                <div
                    key={chat.convo_id}
                    onClick={() => setActiveConversation(chat.convo_id)}
                    style={{
                        fontWeight: activeConversation === chat.convo_id ? "bold" : "normal",
                        cursor: "pointer"
                    }}
                >
                    💬 {chat.title }

                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                        {chat.last_message_time}
                    </div>
                </div>
            ))}
        </div>
    );
}