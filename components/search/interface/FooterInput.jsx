import React from "react";
import { Mic, Search, BrainCircuit, ArrowUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./styles/FooterInput.css";

export default function FooterInput({ inputValue, setInputValue, handleSubmit }) {
    return (
        <footer className="chat-footer floating">
            <div className="footer-container">
                <form onSubmit={e => handleSubmit(e)} className="footer-form">
                    <div className="floating-input-container">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Ask a follow-up"
                            className="floating-input"
                        />
                    </div>
               </form>
            </div>
        </footer>
    );
}
