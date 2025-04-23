"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import QueryHeader from "./QueryHeader";
import WelcomeScreen from "./WelcomeScreen";
import MessagesContainer from "./MessagesContainer";
import FooterInput from "./FooterInput";
import { searchService } from "@/services/SearchService";

import "./styles/ChatInterface.css";
import Artifact from "@/components/search/artifact";

export default function ChatInterface() {
    const [chatStarted, setChatStarted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [currentQuery, setCurrentQuery] = useState("");
    const [users, setUsers] = useState(new Set());
    const [usersFound, setUsersFound] = useState([]);

    useEffect(() => {
        console.log(users);
    }, [users]);

    const streamThought = chunk => {
        setMessages(prevMessages => {
            let newMessage = [...prevMessages];
            if (newMessage.length > 0 && newMessage[newMessage.length - 1].role === "assistant") {
                newMessage[newMessage.length - 1] = {
                    ...newMessage[newMessage.length - 1],
                    content: newMessage[newMessage.length - 1].content + chunk,
                };
            } else {
                newMessage.push({ role: "assistant", content: chunk });
            }

            return newMessage;
        });
    };

    const streamResponse = chunk => {
        setMessages(prevMessages => {
            let newMessage = [...prevMessages];
            if (newMessage[newMessage.length - 1].response) {
                newMessage[newMessage.length - 1] = {
                    ...newMessage[newMessage.length - 1],
                    response: newMessage[newMessage.length - 1].response + chunk,
                };
            } else {
                newMessage[newMessage.length - 1] = {
                    ...newMessage[newMessage.length - 1],
                    response: chunk,
                };
            }

            return newMessage;
        });
    };

    const handleSubmit = async (e, value) => {
        e?.preventDefault();
        const inputToUse = value || inputValue;

        if (!inputToUse.trim()) return;

        setCurrentQuery(inputToUse);

        const newMessages = [...messages, { role: "user", content: inputToUse }];
        setMessages(newMessages);
        setInputValue("");
        setChatStarted(true);

        try {
            await searchService.search(inputToUse, {
                onThought: message => streamThought(message),
                onResponse: message => streamResponse(message),
                onUsers: message =>
                    setUsers(prev => {
                        const temp = new Set(prev);
                        message.forEach(user => temp.add(user));
                        return temp;
                    }),
                onFoundUsers: message => setUsersFound(prev => [...prev, message]),
            });
        } catch (e) {
            console.error("Error with streaming", e);
        }
    };

    return (
        <div className="chat-container">
            <Header />
            {chatStarted && <QueryHeader query={currentQuery} />}
            <main className="chat-main">
                {!chatStarted ? (
                    <WelcomeScreen
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSubmit={handleSubmit}
                    />
                ) : (
                    <div className="messages">
                        <div
                            className={`messages-scrollable ${usersFound.length > 0 ? "artifact" : ""}`}
                        >
                            <MessagesContainer messages={messages} users={users} />
                            {chatStarted && (
                                <FooterInput
                                    inputValue={inputValue}
                                    setInputValue={setInputValue}
                                    handleSubmit={handleSubmit}
                                />
                            )}
                        </div>
                        {usersFound.length > 0 && <Artifact usersFound={usersFound} />}
                    </div>
                )}
            </main>
        </div>
    );
}
