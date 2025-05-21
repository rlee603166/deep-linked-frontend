"use client";
import React from "react";
import { useState, useEffect } from "react";
import { BrainCircuit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
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
    const [showAllUsers, setShowAllUsers] = useState(false);
    
    const MAX_VISIBLE_USERS = 5;

    useEffect(() => {
        const deepContainer = document.querySelector(".deep-search-container");
        if (deepContainer) {
            deepContainer.scrollTo({ top: deepContainer.scrollHeight, behavior: "smooth" });
        }
        setResearchText(thought);
    }, [thought]);

    useEffect(() => {
        if (users && Array.isArray(users)) {
            setProfiles([...users]);
        }
    }, [users]);

    // Handle showing all users or collapsed view
    const handleToggleUsers = () => {
        setShowAllUsers(!showAllUsers);
    };

    // Get visible users based on current state
    const getVisibleUsers = () => {
        if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
            return [];
        }
        
        if (showAllUsers || profiles.length <= MAX_VISIBLE_USERS) {
            return profiles;
        }
        
        return profiles.slice(0, MAX_VISIBLE_USERS);
    };

    // Count of hidden users
    const hiddenUsersCount = profiles && Array.isArray(profiles) ? 
        Math.max(0, profiles.length - MAX_VISIBLE_USERS) : 0;

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
                        {profiles && profiles.length > 0 && (
                            <>
                                <p className="reading-label">Reading Users...</p>
                                <div className="source-badges">
                                    {getVisibleUsers().map(profile => (
                                        <UserBadge
                                            key={profile.user_id || Math.random().toString()}
                                            firstName={profile.first_name}
                                            lastName={profile.last_name}
                                            profilePicture={profile.pfp_url}
                                        />
                                    ))}
                                    
                                    {hiddenUsersCount > 0 && (
                                        <button 
                                            className="more-users-badge flex items-center px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                            onClick={handleToggleUsers}
                                            type="button"
                                        >
                                            <span>
                                                {showAllUsers 
                                                    ? "Show Less" 
                                                    : `${hiddenUsersCount} more`}
                                            </span>
                                            {showAllUsers 
                                                ? <ChevronUp className="h-4 w-4 ml-1" /> 
                                                : <ChevronDown className="h-4 w-4 ml-1" />}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
