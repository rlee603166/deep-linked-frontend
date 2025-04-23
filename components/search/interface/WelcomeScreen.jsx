import React from "react";
import { Mic, ArrowUp, Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./styles/WelcomeScreen.css";

export default function WelcomeScreen({ inputValue, setInputValue, handleSubmit }) {
    return (
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
                        placeholder="What do you want to know?"
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
            {/*<div className="suggestion-buttons">
                <Button variant="outline" className="suggestion-button">
                    <Sparkles className="icon-tiny" />
                    Pro
                </Button>
                <Button variant="outline" className="suggestion-button">
                    <BrainCircuit className="icon-tiny" />
                    Deep
                </Button>
            </div>*/}
        </div>
    );
}
