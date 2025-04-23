import ReactMarkdown from "react-markdown";
import "@/components/search/styles/format-llm.css";

export default function FormattedLLMText({ text }) {
    if (!text) return null;
    return (
        <div className="llm-formatted-text">
            <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    );
}
