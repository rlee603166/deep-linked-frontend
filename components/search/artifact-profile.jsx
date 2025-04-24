import React, { useEffect } from "react";
import { ChevronLeft, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import "./styles/artifact-profile.css";
import { Experiences, Educations } from "./vertical-timelines";

function sortExperiences(experiences) {
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

export default function ArtifactProfile({ user, handleBack }) {
    const fullName = user.first_name + " " + user.last_name;
    const sortedExperiences = sortExperiences(user.experiences);
    const sortedEducations = sortEducations(user.educations);
    console.log(JSON.stringify(user, null, 2));

    return (
        <div className="profile-container">
            <div className="relative">
                {/* Cover Photo */}

                <ChevronLeft className="arrow" onClick={() => handleBack()} />
                <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 relative z-0"></div>

                {/* Profile Section */}
                <div className="px-4 lg:px-8 max-w-4xl mx-auto">
                    <div className="relative -mt-16 mb-6">
                        <div className="flex flex-col">
                            <div className="relative mb-4">
                                <Avatar className="h-32 w-32 rounded-full border-4 border-white shadow-sm">
                                    <AvatarImage
                                        src={user.pfp_url}
                                        alt={
                                            user
                                                ? `${user.first_name} ${user.last_name}`
                                                : "Profile"
                                        }
                                    />
                                    <AvatarFallback className="bg-blue-50 text-blue-500 text-xl">
                                        {user ? `${user.first_name[0]}${user.last_name[0]}` : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h1 className="text-2xl font-bold">
                                            {user
                                                ? `${user.first_name} ${user.last_name}`
                                                : "User Name"}
                                        </h1>
                                        <p className="text-base text-gray-600">
                                            {sortedExperiences && sortedExperiences.length > 0
                                                ? sortedExperiences[0].job_title
                                                : "Professional Title"}
                                        </p>

                                        <div className="flex items-center text-sm text-gray-500 flex-wrap gap-y-2 mt-2">
                                            {sortedExperiences && sortedExperiences.length > 0 && (
                                                <span className="flex items-center mr-4">
                                                    <Briefcase className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    {sortedExperiences[0].company_name}
                                                </span>
                                            )}

                                            {sortedEducations && sortedEducations.length > 0 && (
                                                <span className="flex items-center mr-4">
                                                    <GraduationCap className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    {sortedEducations[0].institution_name}
                                                </span>
                                            )}

                                            {sortedExperiences && sortedExperiences.length > 0 && (
                                                <span className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    {sortedExperiences[0].location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="vertical-timeline">
                <div className="experience-header">Experience</div>
                <Experiences experiences={sortedExperiences} />

                <div className="experience-header">Education</div>
                <Educations educations={sortedEducations} />
            </div>
        </div>
    );
}
