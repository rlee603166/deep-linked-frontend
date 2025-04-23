import { useEffect } from "react";
import Box from "@mui/material/Box";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";

import "./styles/artifact-profile.css";

export const Experiences = ({ experiences }) => {
    const fullDate = exp => {
        const start = exp.start_date ? exp.start_date.split("-") : null;
        const end = exp.end_date ? exp.end_date.split("-") : null;
        return `${start ? `${start[1]}/${start[0]} -` : null} ${end ? `${end[1]}/${end[0]}` : "Present"}`;
    };

    const companyLogo = exp => {
        const LOGO_TOKEN = process.env.NEXT_PUBLIC_LOGO_TOKEN;
        const company_name = exp.company_name.replace(/ /g, "");
        return `https://img.logo.dev/${company_name}.com?token=${LOGO_TOKEN}`;
    };

    return (
        <div>
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {experiences.length > 0 &&
                    experiences.map((exp, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 40,
                                        height: 40,
                                        overflow: "hidden",
                                        marginTop: "15px", // Adjust this value (5px, 8px, 10px, etc.)
                                        marginBottom: "10px"
                                    }}
                                >
                                    <img
                                        src={companyLogo(exp)}
                                        alt={exp ? `${exp.company_name}` : "Company"}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            padding: 4,
                                        }}
                                    />
                                </Box>
                                {index < experiences.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: "12px", px: 2 }}>
                                {/* Your existing content */}
                                <div className="experience">
                                    <div className="job-title">{exp.job_title}</div>
                                    <div className="company-name">{exp.company_name}</div>
                                    <div className="dates">{fullDate(exp)}</div>
                                </div>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
            </Timeline>
        </div>
    );
};

export const Educations = ({ educations }) => {
    const fullDate = edu => {
        const start = edu.enrollment_date.split("-");
        const end = edu.graduation_date ? edu.graduation_date.split("-") : null;
        return `${start[1]}/${start[0]} - ${end ? `${end[1]}/${end[0]}` : "Present"}`;
    };

    const degree = edu => {
        return `${edu.degree_type} in ${edu.degree_name}`;
    };

    return (
        <div>
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {educations.length > 0 &&
                    educations.map((edu, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot />
                                {index < educations.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <div className="experience">
                                    <div className="job-title">{edu.institution_name}</div>
                                    <div className="company-name">{degree(edu)}</div>
                                    <div className="dates">{fullDate(edu)}</div>
                                </div>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
            </Timeline>
        </div>
    );
};
