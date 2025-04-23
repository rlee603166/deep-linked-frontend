import React from "react";
import AssistantMessage from "./AssistantMessage";
import "./styles/MessagesContainer.css";

export default function MessagesContainer({ messages, users }) {
    return (
        <div className="messages-container">
            <div className="messages-content">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message-wrapper ${
                            message.role === "user"
                                ? "user-message-wrapper hidden"
                                : "assistant-message-wrapper"
                        }`}
                    >
                        {message.role === "assistant" && (
                            <AssistantMessage message={message} users={users} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
