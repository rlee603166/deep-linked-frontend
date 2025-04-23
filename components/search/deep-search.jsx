"use client";

import React from "react";
import { useState, useEffect } from "react";
import { BrainCircuit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight } from "lucide-react";

import "@/components/search/styles/deep-search.css";
import UserBadge from "@/components/search/user-badge";
import { searchService } from "@/services/SearchService";
import FormattedLLMText from "@/components/search/format-llm";

export default function DeepSearch({ thought, users }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [hasResults, setHasResults] = useState(false);
    const [researchText, setResearchText] = useState("");
    const [actions, setActions] = useState([]);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const deepContainer = document.querySelector(".deep-search-container");
        deepContainer.scrollTo({ top: deepContainer.scrollHeight, behavior: "smooth" });
        setResearchText(thought);
    }, [thought]);

    useEffect(() => {
        setProfiles([...users]);
    }, [users]);

    return (
        <div className="deep-search-wrapper">
            {/* Fixed header */}
            <div className="deep-search-fixed-header">
                <div className="header-icon-group">
                    <BrainCircuit className="icon-tiny" />
                    <span className="font-medium">Deep Search</span>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="deep-search-container">
                <div className="deep-search-content">
                    <div className="mb-4">
                        <FormattedLLMText text={researchText} />
                    </div>
                    <div>
                        {profiles.length > 0 && (
                            <>
                                <p className="reading-label">Reading Users...</p>
                                <div className="source-badges">
                                    {profiles.map(profile => (
                                        <UserBadge
                                            key={profile.user_id}
                                            firstName={profile.first_name}
                                            lastName={profile.last_name}
                                            profilePicture={profile.pfp_url}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
