import { useState } from "react";

import "./chatInput.css";

export default function ChatInput({ onSend }) {

    const [text, setText] = useState("");

    const handleSend = () => {

        if (!text.trim()) return;

        onSend(text);

        setText("");
    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="chat-input-container">

            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <button onClick={handleSend}>
                Send
            </button>

        </div>
    );
}