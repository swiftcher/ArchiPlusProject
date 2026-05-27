import { useEffect, useState,useContext } from "react";

import apiPrivate from "../../api/apiPrivate";
import socket from "../../pages/socket";

  import { AuthContext } from "../../context/AuthContext";
  import "./chatSidebar.css"

    import { useRef } from "react";

export default function ChatSidebar({
    activeConversation,
    setActiveConversation,
    
}) {


const activeConversationRef = useRef(null);
useEffect(() => {
    activeConversationRef.current = activeConversation;
}, [activeConversation]);


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
                    last_message_time: data.last_message_time,
                    unread:
                        data.sender_id !== user.id &&
                        activeConversationRef.current !== data.convo_id
                }
                : c
                );

            // find updated convo
            const active = updated.find(
                c => c.convo_id === data.convo_id
            );

            // remove it from array
            const others = updated.filter(
                c => c.convo_id !== data.convo_id
            );

            // put updated convo first
            return [active, ...others];
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
    <div className="chat-sidebar-container">

        <h3 className="chat-sidebar-title">
            Conversations
        </h3>

        <button className="chat-sidebar-btn" onClick={startSupportChat}>
            💬 Contact Support
        </button>

        <button className="chat-sidebar-btn secondary" onClick={startnewconvo}>
            ✨ New Conversation
        </button>

        <div className="chat-sidebar-list">

            {chats.map(chat => (
                <div
                    key={chat.convo_id}

                    onClick={() => {

                        setActiveConversation(chat.convo_id);

                        setChats(prev =>
                            prev.map(c =>
                                c.convo_id === chat.convo_id
                                    ? { ...c, unread: false }
                                    : c
                            )
                        );
                    }}
                    className={`chat-sidebar-item
                    ${activeConversation === chat.convo_id ? "active" : ""}
                    ${chat.unread ? "unread" : ""}
                    `}
                >
                    <div className="chat-title">
                        💬 {chat.title}
                    </div>

                    <div className="chat-meta">
                        {chat.last_message_time}
                    </div>
                </div>
            ))}

        </div>

    </div>
);
}