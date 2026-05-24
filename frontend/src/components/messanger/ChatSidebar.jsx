import { useEffect, useState,useContext } from "react";
import api from "../../api/axios";
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

    api.get("/users/conversations")
    .then(res => {
        console.log("CONVOS:", res.data);
        setChats(res.data);
    })

}, [user.id]);

useEffect(() => {

    const handleNewMessage = (msg) => {

        setChats((prev) => {

            // check if convo already exists
            const exists = prev.find(
                c => c.convo_id === msg.conversation_id
            );

            // if convo doesn't exist -> create it
            if (!exists) {

                return [
                    {
                        convo_id: msg.conversation_id,
                        title: msg.title || "New Conversation",
                        last_message_time: "New message"
                    },
                    ...prev
                ];
            }

            // update existing convo
            const updated = prev.map(c =>
                c.convo_id === msg.conversation_id
                    ? {
                        ...c,
                        last_message_time: "New message"
                    }
                    : c
            );

            // move active convo to top
            updated.sort((a) =>
            a.convo_id === msg.conversation_id ? -1 : 1
        );

            return updated;
        });
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
        socket.off("receive_message", handleNewMessage);
    };

}, []);

    

const startSupportChat = async () => {
    try {
        const res = await api.post("/users/conversations/create-or-get");

        setActiveConversation(res.data.convo_id);

    } catch (err) {
        console.log("create-or-get error:", err);
    }
};

const startnewconvo = async () => {
    try {
        const res = await api.post("/users/conversations/create");

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
                    💬 {chat.title || "Conversation"}

                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                        {chat.last_message_time}
                    </div>
                </div>
            ))}
        </div>
    );
}