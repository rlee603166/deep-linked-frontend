"use client";

import { useRouter } from "next/router"
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Header from "@/components/search/interface/Header";
import QueryHeader from "@/components/search/interface/QueryHeader";
import WelcomeScreen from "@/components/search/interface/WelcomeScreen";
import MessagesContainer from "@/components/search/interface/MessagesContainer";
import FooterInput from "@/components/search/interface/FooterInput";
import { searchService } from "@/services/SearchService";

import "@/components/search/interface/styles/ChatInterface.css";
import Artifact from "@/components/search/artifact";

export default function Page() {
    const params = useParams();
    const session_id = params.session_id;

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [currentQuery, setCurrentQuery] = useState("");
    const [users, setUsers] = useState(new Set());
    const [usersFound, setUsersFound] = useState([]);

    useEffect(() => {
        const boot = async () => {
            const storedQuery = localStorage.getItem("userQuery");

            if (storedQuery) {
                localStorage.removeItem("userQuery");
                setCurrentQuery(storedQuery);
                setMessages([{ role: "user", content: storedQuery }]);

                await searchService.search(session_id, storedQuery, {
                    onThought: message => streamThought(message),
                    onResponse: message => streamResponse(message),
                    onUsers: message => setUsers(prev => new Set([...prev, ...message])),
                    onFoundUsers: message => setUsersFound(message),
                });
            } else {
                // const pastMessages = await searchService.loadSession(session_id);
                // setMessages(pastMessages);
            }
        };

        if (session_id) boot();
    }, [session_id]);

    // const filterUsers = (users) => {
    //     if usersFound.length === 0 {
    //         setUsersFound([...users]);
    //         return
    //     }
    //     setUsers([...usersFound.filter(user => user.user_id === users)]);
    // }

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

        try {
            await searchService.search(session_id, inputToUse, {
                onThought: message => streamThought(message),
                onResponse: message => streamResponse(message),
                onUsers: message =>
                    setUsers(prev => {
                        const temp = new Set(prev);
                        message.forEach(user => temp.add(user));
                        return temp;
                    }),
                onFoundUsers: message => setUsersFound(message),
            });
        } catch (e) {
            console.error("Error with streaming", e);
        }
    };

    return (
        <div className="chat-container">
            <Header />
            <QueryHeader query={currentQuery} />
            <main className="chat-main">
                <div className="messages">
                    <div
                        className={`messages-scrollable ${usersFound.length > 0 ? "artifact" : ""}`}
                    >
                        <MessagesContainer messages={messages} users={users} />
                        <FooterInput
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                    {usersFound.length > 0 && <Artifact usersFound={usersFound} />}
                </div>
            </main>
        </div>
    );
}
