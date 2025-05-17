"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, ArrowUp, Sparkles, BrainCircuit } from "lucide-react";

import Header from "./Header";
import "./styles/WelcomeScreen.css";
import "./styles/ChatInterface.css";
import { searchService } from "@/services/SearchService";

export default function WelcomeScreen() {
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e?.preventDefault();
        const inputToUse = inputValue.trim();

        if (!inputToUse) return;

        try {
            localStorage.setItem("userQuery", inputToUse);
            const session_id = await searchService.createSession();
            router.push(`/chat/${session_id}`);
        } catch (e) {
            console.error("Error with streaming", e);
        }
    };


    return (

        <div className="chat-container">
            <Header />
            <main className="chat-main">
                <div className="welcome-container">
                    <div className="welcome-text">
                        <h1 className="welcome-heading">Good morning.</h1>
                        <p className="welcome-subheading">How can I help you today?</p>
                    </div>
                    <form onSubmit={handleSubmit} className="input-form">
                        <div className="input-container">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Who do you want to find?"
                                className="main-input"
                            />
                            <div className="input-buttons">
                                <Button type="button" variant="ghost" size="icon" className="input-button">
                                    <Mic className="icon-small" />
                                </Button>
                                <Button type="submit" variant="ghost" size="icon" className="input-button">
                                    <ArrowUp className="icon-small" />
                                </Button>
                            </div>
                        </div>
                    </form>
               </div>
            </main>
        </div>
    );
}
