import { useEffect, useState, useContext, useRef } from "react";

import apiPrivate from "../../api/apiPrivate";
import socket from "../../pages/socket";

import { AuthContext } from "../../context/AuthContext";

import "./chatSidebar.css";

export default function ChatSidebar({
  activeConversation,
  setActiveConversation,
  isAdmin,
}) {
  const { user } = useContext(AuthContext);

  const [chats, setChats] = useState([]);

  const activeConversationRef = useRef(null);

  const currentUserId = user?.id || user?.U_ID;

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // LOAD CONVERSATIONS

  useEffect(() => {
    if (!currentUserId) return;

    apiPrivate
      .get(isAdmin ? "/admin/messenger" : "/users/conversations")
      .then((res) => {
        console.log("CONVOS:", res.data);

        setChats(res.data);
      })
      .catch((err) => console.log(err));
  }, [currentUserId]);

  // SOCKET UPDATES

  useEffect(() => {
    const handleConversationUpdate = (data) => {
      setChats((prev) => {
        const exists = prev.find((c) => c.convo_id === data.convo_id);

        // NEW CHAT

        if (!exists) {
          return [
            {
              ...data,
              unread: true,
            },

            ...prev,
          ];
        }

        // UPDATE CHAT

        const updated = prev.map((c) =>
          c.convo_id === data.convo_id
            ? {
                ...c,

                last_message: data.last_message,

                last_message_time: data.last_message_time,

                unread:
                  data.sender_id !== currentUserId &&
                  activeConversationRef.current !== data.convo_id,
              }
            : c,
        );

        // MOVE TO TOP

        const current = updated.find((c) => c.convo_id === data.convo_id);

        return [
          current,

          ...updated.filter((c) => c.convo_id !== data.convo_id),
        ];
      });
    };

    socket.on("conversation_updated", handleConversationUpdate);

    return () => {
      socket.off("conversation_updated", handleConversationUpdate);
    };
  }, [currentUserId]);

  // CREATE / GET SUPPORT CHAT

  const startSupportChat = async () => {
    try {
      const res = await apiPrivate.post("/users/conversations/create-or-get");

      console.log("SUPPORT:", res.data);

      setActiveConversation(res.data.convo_id);
    } catch (err) {
      console.log("CREATE SUPPORT ERROR:", err);
    }
  };

  return (
    <div className="chat-sidebar-container">
      <h3 className="chat-sidebar-title">Conversations</h3>
      {!isAdmin && (
        <button className="chat-sidebar-btn" onClick={startSupportChat}>
          💬 Contact Support
        </button>
      )}

      <div className="chat-sidebar-list">
        {chats.map((chat) => (
          <div
            key={chat.convo_id}
            onClick={() => {
              setActiveConversation(chat.convo_id);

              setChats((prev) =>
                prev.map((c) =>
                  c.convo_id === chat.convo_id
                    ? {
                        ...c,
                        unread: false,
                      }
                    : c,
                ),
              );
            }}
            className={`
chat-sidebar-item

${activeConversation === chat.convo_id ? "active" : ""}

${chat.unread ? "unread" : ""}

`}
          >
            <div className="chat-title">
              💬 {isAdmin ? `${chat.U_Name} ${chat.U_LastName}` : "Support"}
            </div>

            <div className="chat-meta">{chat.last_message_time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
