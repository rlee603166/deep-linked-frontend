import { ENDPOINTS } from "@/api.config.js";

export const searchService = {
    search: async (query, callbacks) => {
        const { onThought, onAction, onResponse, onStatus, onUsers, onFoundUsers } = callbacks;

        try {
            onStatus?.("Processing query...");
            const response = await fetch(ENDPOINTS.search, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    onStatus?.("Completed");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.trim() && line.startsWith("data:")) {
                        try {
                            const jsonString = line.slice(5).trim();
                            if (!jsonString) continue;

                            const data = JSON.parse(jsonString);
                            switch (data.type) {
                                case "thought":
                                    onThought?.(data.message);
                                    break;
                                case "action":
                                    onAction?.(data.message);
                                    break;
                                case "raw_action":
                                case "result":
                                    // onAction?.(data.message);
                                    break;
                                case "users":
                                    onUsers?.(data.message);
                                    break;
                                case "users_found":
                                    onFoundUsers?.(data.message);
                                    break;
                                case "response":
                                    onResponse?.(data.message);
                                    break;
                                case "status":
                                    onStatus?.(data.message);
                                    break;
                                case "end":
                                    onStatus?.("Completed");
                                    return;
                            }
                        } catch (e) {
                            console.error("Error parsing line:", line, e);
                        }
                    }
                }
                onThought?.("");
            }
        } catch (error) {
            console.error("Error:", error);
            onStatus?.("Error: Failed to get response");
        }
    },
};
