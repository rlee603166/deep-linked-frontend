import React from "react";
import { RotateCcw, Download, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormattedLLMText from "@/components/search/format-llm";
import DeepSearch from "@/components/search/deep-search";
import "./styles/AssistantMessage.css";

export default function AssistantMessage({ message, users }) {
    return (
        <div className="assistant-message-container">
            <DeepSearch thought={message.content} users={users} />
            <div className="assistant-message">
                <FormattedLLMText text={message.response} />
            </div>
            {/*<div className="message-actions">
                <Button variant="outline" size="icon" className="action-button">
                    <RotateCcw className="icon-tiny" />
                </Button>
                <Button variant="outline" size="icon" className="action-button">
                    <Download className="icon-tiny" />
                </Button>
                <Button variant="outline" size="icon" className="action-button">
                    <ThumbsUp className="icon-tiny" />
                </Button>
                <Button variant="outline" size="icon" className="action-button">
                    <ThumbsDown className="icon-tiny" />
                </Button>
            </div>*/}
        </div>
    );
}
