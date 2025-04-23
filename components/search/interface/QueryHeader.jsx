import React from "react";
import "./styles/QueryHeader.css";

export default function QueryHeader({ query }) {
    return (
        <div className="query-header">
            <div className="query-container">
                <h2 className="query-text">{query}</h2>
            </div>
        </div>
    );
}
