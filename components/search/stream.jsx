"use client";

import { useState, useEffect } from "react";

export default function Stream() {
    const [thoughtOutput, setThoughtOutput] = useState("");
    const [actionOutput, setActionOutput] = useState("");
    const [responseOutput, setResponseOutput] = useState("");
    const [status, setStatus] = useState("Ready");

    const generateResponse = async () => {
        const query = "Find me software engineers at Google";
        setStatus("Processing query...");

        try {
            const response = await fetch("http://127.0.0.1:8000/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value} = await reader.read();

                if (done) {
                    setStatus("Completed");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });

                const lines = chunk.split("\n\n");
                for (const line of lines) {
                    if (line) {
                        try {
                            const data = JSON.parse(line.trim());
                            console.log(JSON.stringify(data, null, 2));
                            switch (data.type) {
                                case "thought":
                                    console.log(data.message);
                                    setThoughtOutput(prev => prev + data.message);
                                    break;
                                // case "action":
                                case "raw_action":
                                case "result":
                                    setActionOutput(prev => prev + data.message);
                                    break;
                                case "response":
                                    setResponseOutput(prev => prev + data.message);
                                    break;
                                case "status":
                                    setStatus(data.message);
                                    break;
                                case "end":
                                    setStatus("Completed");
                                    return;
                            }
                        } catch (e) {
                            console.error("Error parsing chunk:", e, jsonStr);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus("Error: Failed to get response");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button onClick={generateResponse} className="px-4 py-2 bg-blue-500 text-white rounded">
                Generate Response
            </button>

            <div className="mt-4 p-2 bg-gray-100 rounded">Status: {status}</div>

            <div>
                <div className="border rounded p-4">
                    <h3 className="font-bold mb-2">Thoughts</h3>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-2 h-64 overflow-auto">
                        {thoughtOutput}
                    </pre>
                </div>

                <div className="border rounded p-4">
                    <h3 className="font-bold mb-2">Actions</h3>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-2 h-64 overflow-auto">
                        {actionOutput}
                    </pre>
                </div>

                <div className="border rounded p-4">
                    <h3 className="font-bold mb-2">Response</h3>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-2 h-64 overflow-auto">
                        {responseOutput}
                    </pre>
                </div>
            </div>
        </div>
    );
}
