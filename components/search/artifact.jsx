"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import "./styles/artifact.css";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ENDPOINTS } from "@/api.config.js";
import ArtifactProfile from "./artifact-profile";
import SearchService from "@/services/SearchService";

function sortExperiences(experiences) {
    if (!Array.isArray(experiences)) return [];
    return experiences.slice().sort((a, b) => {
        const parseDate = dateStr => {
            if (!dateStr) return new Date(0);
            const [year, month, day] = dateStr.split("-").map(Number);
            return new Date(year, month - 1, day || 1);
        };

        const aStart = parseDate(a.start_date);
        const bStart = parseDate(b.start_date);
        const aEnd = parseDate(a.end_date);
        const bEnd = parseDate(b.end_date);

        if (bStart > aStart) return 1;
        if (bStart < aStart) return -1;

        if (bEnd > aEnd) return 1;
        if (bEnd < aEnd) return -1;

        return 0;
    });
}

function sortEducations(educations) {
    if (!Array.isArray(educations)) return [];
    return educations.slice().sort((a, b) => {
        const parseDate = dateStr => {
            if (!dateStr) return new Date(0);
            const [year, month, day] = dateStr.split("-").map(Number);
            return new Date(year, month - 1, day || 1);
        };

        const aStart = parseDate(a.enrollment_date);
        const bStart = parseDate(b.enrollment_date);
        const aEnd = parseDate(a.graduation_date);
        const bEnd = parseDate(b.graduation_date);

        if (bStart > aStart) return 1;
        if (bStart < aStart) return -1;

        if (bEnd > aEnd) return 1;
        if (bEnd < aEnd) return -1;

        return 0;
    });
}

const UserCard = ({ index, user, isLast }) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    return (
        <div key={index} className={`${isLast ? "last-user" : "user-card"}`}>
            <img src={user.pfp_url} className="user-image" />
            <div className="user-content">
                <div className="user-header">
                    <div>
                        <div className="user-name-container">
                            <span className="user-name">{fullName}</span>
                            {user.verified && <Check size={16} className="verified-icon" />}
                        </div>
                        <div className="user-title">
                            {`${user.experiences[0].job_title} @ ${user.experiences[0].company_name}`}
                        </div>
                    </div>
                    <button className="connect-button">Connect</button>
                </div>
                <div className="user-bio">{user.bio}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {user.skills.map((skill, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="font-normal bg-slate-100 hover:bg-slate-200 text-slate-700 border-0"
                        >
                            {skill.skill_name}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Artifact({ usersFound }) {
    const [users, setUsers] = useState([]);
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!Array.isArray(usersFound)) return;

        const sortedUsers = usersFound.map(user => ({
            ...user,
            experiences: sortExperiences(user.experiences),
            educations: sortEducations(user.educations),
        }));

        const hasChanged = JSON.stringify(users) !== JSON.stringify(sortedUsers);
        if (hasChanged) {
            setUsers(sortedUsers);
        }
    }, [usersFound]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${ENDPOINTS.search}/vector`);
            const data = await response.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = index => {
        console.log(`getting user at ${index}`);
        console.log(users[index].first_name);
        setSelected(index);
        setStep(1);
    };

    const handleBack = () => {
        setSelected(null);
        setStep(0);
    };

    const render = () => {
        if (isLoading) return <div>Loading...</div>;

        switch (step) {
            case 0:
                return (
                    <div>
                        <div className="artifact-header">
                            <div className="header-text">Users Found</div>
                            <X />
                        </div>
                        <div className="users-container">
                            {users.length > 0 &&
                                users.map((user, index) => (
                                    <div
                                        key={user.user_id}
                                        onClick={() => handleClick(index)}
                                        className="user-container"
                                    >
                                        <UserCard
                                            key={index}
                                            user={user}
                                            isLast={index === users.length - 1}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        {users.length > 0 && selected !== null && (
                            <ArtifactProfile user={users[selected]} handleBack={handleBack} />
                        )}
                    </div>
                );
            default:
                return;
        }
    };

    return <div className="artifact-container">{render()}</div>;
}
