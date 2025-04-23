"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Briefcase,
    GraduationCap,
    MapPin,
    ArrowLeft,
    Calendar,
    ExternalLink,
    Award,
    Users,
    Heart,
    Search,
    Home,
    Compass,
    User,
    Menu,
    AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BulletPointFormatter from "@/components/profile/BulletPointFormatter";

import {
    fetchUserProfile,
    fetchUserExperiences,
    fetchUserEducation,
    fetchUserProjects,
    fetchUserSkills,
    fetchAllUserData,
} from "@/lib/api-service";

export default function ProfilePage() {
    // State variables for UI
    const [activeSection, setActiveSection] = useState("experience");
    const [isMobile, setIsMobile] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const sectionsRef = useRef({});

    // State variables for data
    const [userData, setUserData] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState(null);

    // User ID - could come from route params, context, etc.
    const userId = 1; // Default to user 1 for now

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Option 1: Fetch everything in parallel for better performance
                const { profile, experiences, educations, projects, skills } =
                    await fetchUserProfile(userId);

                // Update state with fetched data
                setUserData(profile);
                setExperiences(experiences || []);
                setEducation(educations || []);
                setProjects(projects || []);
                setSkills(skills || []);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load profile data. Please try again later.");
            } finally {
                // Set loading to false, but add slight delay for smooth transition
                setTimeout(() => {
                    setIsLoading(false);
                }, 400);
            }
        };

        fetchData();
    }, [userId]);

    // UI Effects
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const sectionRefs = {
        experience: "Experience",
        education: "Education",
        activities: "Activities",
        projects: "Projects",
        skills: "Skills",
        interests: "Interests",
    };

    const handleSectionChange = section => {
        setActiveSection(section);
        const element = document.getElementById(section);
        if (element) {
            const headerOffset = 60;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    // Observe which section is currently in view
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-100px 0px -70% 0px",
            threshold: 0,
        };

        const handleIntersect = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        Object.keys(sectionRefs).forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [isLoading]);

    // Format date strings from API
    const formatDate = dateString => {
        if (!dateString) return "Present";

        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    // Organize skills by category (helper function)
    const organizeSkillsByCategory = skills => {
        const categories = {
            "Core Skills": [],
            "Professional Skills": [],
            "Tools & Technologies": [],
        };

        // If we had categories in the API, we'd use them
        // For now, let's assume all skills have a proficiency_level that might indicate category
        skills.forEach(skill => {
            if (skill.proficiency_level === "Expert" || skill.proficiency_level === "Advanced") {
                categories["Core Skills"].push(skill);
            } else if (skill.proficiency_level === "Intermediate") {
                categories["Professional Skills"].push(skill);
            } else {
                categories["Tools & Technologies"].push(skill);
            }
        });

        return categories;
    };

    // Get organized skills
    const organizedSkills = organizeSkillsByCategory(skills);

    // Error display component
    const ErrorAlert = ({ message }) => (
        <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Sidebar - Desktop Only */}
            <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-100">
                <div className="p-4">
                    <h1 className="text-xl font-bold">DeepLinked</h1>
                </div>

                <nav className="flex-1 py-8">
                    <div className="space-y-1 px-3">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-700 hover:bg-gray-50 rounded-full h-12"
                        >
                            <Home className="h-5 w-5 mr-3" />
                            Home
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-700 hover:bg-gray-50 rounded-full h-12 bg-gray-50"
                        >
                            <Compass className="h-5 w-5 mr-3" />
                            Explore
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-700 hover:bg-gray-50 rounded-full h-12"
                        >
                            <User className="h-5 w-5 mr-3" />
                            Profile
                        </Button>
                    </div>

                    <div className="mt-12 px-3">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">
                                ON THIS PAGE
                            </p>
                            <div className="space-y-1">
                                {Object.entries(sectionRefs).map(([key, value]) => (
                                    <Button
                                        key={key}
                                        variant="ghost"
                                        className={`w-full justify-start text-sm rounded-full h-10 ${
                                            activeSection === key
                                                ? "font-medium text-black bg-white"
                                                : "text-gray-600 hover:bg-white"
                                        }`}
                                        onClick={() => handleSectionChange(key)}
                                    >
                                        {value}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-h-screen max-w-screen-xl mx-auto">
                {/* Mobile Header */}
                <header
                    className={`lg:hidden sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-gray-100 ${
                        scrollPosition > 180 ? "shadow-sm" : ""
                    }`}
                >
                    <div className="flex items-center justify-between p-4">
                        {scrollPosition > 180 ? (
                            <div className="flex items-center">
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <span className="font-medium">
                                    {userData
                                        ? `${userData.first_name} ${userData.last_name}`
                                        : "User Name"}
                                </span>
                            </div>
                        ) : (
                            <h1 className="text-xl font-bold">DeepLinked</h1>
                        )}

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Section Navigation */}
                    <div className="md:hidden sticky top-[57px] z-20 bg-white/90 backdrop-blur-md border-b">
                        <div className="container px-4">
                            <div className="py-2 bg-white relative">
                                <div className="flex items-center">
                                    <div className="flex overflow-x-auto scrollbar-hide gap-1 py-1 w-full">
                                        {Object.entries(sectionRefs).map(([key, value]) => (
                                            <Button
                                                key={key}
                                                variant={
                                                    activeSection === key ? "default" : "ghost"
                                                }
                                                size="sm"
                                                className={`whitespace-nowrap rounded-full px-4 text-sm font-medium transition-all duration-200 ${
                                                    activeSection === key
                                                        ? "bg-black text-white hover:bg-gray-800"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                                onClick={() => handleSectionChange(key)}
                                            >
                                                {value}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Desktop Header */}
                <header className="hidden lg:block sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-gray-100">
                    <div className="flex items-center justify-end h-14 px-6">
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="sm" className="rounded-full">
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full text-blue-500"
                            >
                                Home
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Show error if any */}
                {error && (
                    <div className="px-4 lg:px-8 max-w-4xl mx-auto pt-4">
                        <ErrorAlert message={error} />
                    </div>
                )}

                {/* Profile Header */}
                <div className="relative">
                    {/* Cover Photo */}
                    <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 relative"></div>

                    {/* Profile Section */}
                    <div className="px-4 lg:px-8 max-w-4xl mx-auto">
                        <div className="relative -mt-16 mb-6">
                            <div className="flex flex-col">
                                {/* Profile Image */}
                                {isLoading ? (
                                    <Skeleton className="h-32 w-32 rounded-full border-4 border-white mb-3" />
                                ) : (
                                    <div className="relative mb-4">
                                        <Avatar className="h-32 w-32 rounded-full border-4 border-white shadow-sm">
                                            <AvatarImage
                                                src="/placeholder.svg?height=128&width=128"
                                                alt={
                                                    userData
                                                        ? `${userData.first_name} ${userData.last_name}`
                                                        : "Profile"
                                                }
                                            />
                                            <AvatarFallback className="bg-blue-50 text-blue-500 text-xl">
                                                {userData
                                                    ? `${userData.first_name[0]}${userData.last_name[0]}`
                                                    : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}

                                {/* Profile Info */}
                                <div className="flex-1 space-y-2">
                                    {isLoading ? (
                                        <div className="space-y-3">
                                            <Skeleton className="h-7 w-48" />
                                            <Skeleton className="h-5 w-72" />
                                        </div>
                                    ) : (
                                        <div>
                                            <h1 className="text-2xl font-bold">
                                                {userData
                                                    ? `${userData.first_name} ${userData.last_name}`
                                                    : "User Name"}
                                            </h1>
                                            <p className="text-base text-gray-600">
                                                {experiences && experiences.length > 0
                                                    ? experiences[0].job_title
                                                    : "Professional Title"}
                                            </p>

                                            <div className="flex items-center text-sm text-gray-500 flex-wrap gap-y-2 mt-2">
                                                {experiences && experiences.length > 0 && (
                                                    <span className="flex items-center mr-4">
                                                        <Briefcase className="h-4 w-4 mr-1.5 text-gray-400" />
                                                        {experiences[0].company_name}
                                                    </span>
                                                )}

                                                {education && education.length > 0 && (
                                                    <span className="flex items-center mr-4">
                                                        <GraduationCap className="h-4 w-4 mr-1.5 text-gray-400" />
                                                        {education[0].institution_name}
                                                    </span>
                                                )}

                                                {experiences && experiences.length > 0 && (
                                                    <span className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                                        {experiences[0].location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Separator className="mb-6" />
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="px-4 lg:px-8 max-w-4xl mx-auto pb-20">
                    {/* Experience Section */}
                    <section
                        id="experience"
                        className="py-6"
                        ref={el => (sectionsRef.current.experience = el)}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Experience</h2>
                        </div>

                        {isLoading ? (
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-16 w-full mt-2" />
                                    </div>
                                </div>
                                <Separator className="bg-gray-100" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-16 w-full mt-2" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {experiences && experiences.length > 0 ? (
                                    experiences.map((exp, index) => (
                                        <div key={exp.experience_id || index} className="group">
                                            <div className="flex gap-4">
                                                <Avatar className="h-12 w-12 rounded-full bg-gray-50 flex-shrink-0">
                                                    <AvatarImage
                                                        src="/placeholder.svg?height=48&width=48"
                                                        alt={exp.company_name}
                                                    />
                                                    <AvatarFallback className="bg-gray-100 text-gray-400">
                                                        {exp.company_name
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">
                                                                {exp.job_title}
                                                            </h3>
                                                            <p className="text-gray-600">
                                                                {exp.company_name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {formatDate(exp.start_date)} -{" "}
                                                                {formatDate(exp.end_date)} ·{" "}
                                                                {exp.location}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <BulletPointFormatter
                                                        text={exp.experience_description}
                                                        className="mt-4 text-gray-600 leading-relaxed"
                                                    />
                                                </div>
                                            </div>
                                            {index < experiences.length - 1 && (
                                                <Separator className="my-6 bg-gray-100" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">
                                        No experience information available.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <Separator className="my-4 bg-gray-100" />

                    {/* Education Section */}
                    <section
                        id="education"
                        className="py-6"
                        ref={el => (sectionsRef.current.education = el)}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Education</h2>
                        </div>

                        {isLoading ? (
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-4 w-64" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-16 w-full mt-2" />
                                    </div>
                                </div>
                                <Separator className="bg-gray-100" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-4 w-64" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-16 w-full mt-2" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {education && education.length > 0 ? (
                                    education.map((edu, index) => (
                                        <div key={edu.education_id || index} className="group">
                                            <div className="flex gap-4">
                                                <Avatar className="h-12 w-12 rounded-full bg-gray-50 flex-shrink-0">
                                                    <AvatarImage
                                                        src="/placeholder.svg?height=48&width=48"
                                                        alt={edu.institution_name}
                                                    />
                                                    <AvatarFallback className="bg-gray-100 text-gray-400">
                                                        {edu.institution_name
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">
                                                                {edu.institution_name}
                                                            </h3>
                                                            <p className="text-gray-600">
                                                                {edu.degree_type} in{" "}
                                                                {edu.degree_name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {formatDate(edu.enrollment_date)} -{" "}
                                                                {formatDate(edu.graduation_date) ||
                                                                    "Present"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < education.length - 1 && (
                                                <Separator className="my-6 bg-gray-100" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">
                                        No education information available.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <Separator className="my-4 bg-gray-100" />

                    {/* Activities Section */}
                    <section
                        id="activities"
                        className="py-6"
                        ref={el => (sectionsRef.current.activities = el)}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Activities</h2>
                        </div>

                        {isLoading ? (
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-5 w-64" />
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-16 w-full mt-2" />
                                    </div>
                                </div>
                                <Separator className="bg-gray-100" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-5 w-64" />
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-16 w-full mt-2" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Currently using static activities data, as there's no activities endpoint */}
                                <div className="group">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12 rounded-full bg-gray-50 flex-shrink-0">
                                            <AvatarImage
                                                src="/placeholder.svg?height=48&width=48"
                                                alt="UX Design Conference"
                                            />
                                            <AvatarFallback className="bg-gray-100 text-gray-400">
                                                UX
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        Speaker at UX Design Conference 2023
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        June 2023 · San Francisco, CA
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-4 text-gray-600 leading-relaxed">
                                                Presented on "Designing for Accessibility: Best
                                                Practices and Case Studies" to an audience of 300+
                                                design professionals. Shared insights on creating
                                                inclusive digital products.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12 rounded-full bg-gray-50 flex-shrink-0">
                                            <AvatarImage
                                                src="/placeholder.svg?height=48&width=48"
                                                alt="Design Mentorship Program"
                                            />
                                            <AvatarFallback className="bg-gray-100 text-gray-400">
                                                DM
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        Mentor at Design Mentorship Program
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Jan 2022 - Present
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-4 text-gray-600 leading-relaxed">
                                                Providing guidance and feedback to emerging
                                                designers. Conducting monthly portfolio reviews and
                                                career development sessions. Mentored over 15
                                                designers who have gone on to secure roles at top
                                                tech companies.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <Separator className="my-4 bg-gray-100" />

                    {/* Projects Section */}
                    <section
                        id="projects"
                        className="py-6"
                        ref={el => (sectionsRef.current.projects = el)}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Projects</h2>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="w-full">
                                    <Skeleton className="h-48 w-full rounded-2xl mb-4" />
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-16 w-full mb-3" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Skeleton className="h-48 w-full rounded-2xl mb-4" />
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-16 w-full mb-3" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2">
                                {projects && projects.length > 0 ? (
                                    projects.map((project, index) => (
                                        <div
                                            key={project.project_id || index}
                                            className="group overflow-hidden rounded-2xl bg-gray-50 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                                                <Image
                                                    src="/placeholder.svg?height=200&width=400"
                                                    alt={project.project_name}
                                                    width={400}
                                                    height={200}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg">
                                                    {project.project_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 mb-3">
                                                    {project.project_start_date &&
                                                        formatDate(project.project_start_date)}
                                                    {project.project_start_date &&
                                                        project.project_end_date &&
                                                        " - "}
                                                    {project.project_end_date
                                                        ? formatDate(project.project_end_date)
                                                        : ""}
                                                </p>
                                                <BulletPointFormatter
                                                    text={project.description}
                                                    className="text-sm text-gray-600 mb-4"
                                                />
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.github_url && (
                                                        <a
                                                            href={project.github_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-gray-100 text-gray-600 border-0 font-normal text-xs px-2 py-0.5 rounded-full"
                                                            >
                                                                GitHub
                                                            </Badge>
                                                        </a>
                                                    )}
                                                    {project.project_url && (
                                                        <a
                                                            href={project.project_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-gray-100 text-gray-600 border-0 font-normal text-xs px-2 py-0.5 rounded-full"
                                                            >
                                                                Live Demo
                                                            </Badge>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 col-span-2">
                                        No projects available.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <Separator className="my-4 bg-gray-100" />

                    {/* Skills Section */}
                    <section
                        id="skills"
                        className="py-6"
                        ref={el => (sectionsRef.current.skills = el)}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Skills</h2>
                        </div>

                        {isLoading ? (
                            <div className="space-y-6">
                                <div>
                                    <Skeleton className="h-6 w-32 mb-3" />
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-28" />
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-26" />
                                    </div>
                                </div>
                                <div>
                                    <Skeleton className="h-6 w-32 mb-3" />
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton className="h-8 w-36" />
                                        <Skeleton className="h-8 w-28" />
                                        <Skeleton className="h-8 w-32" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {skills && skills.length > 0 ? (
                                    Object.entries(organizedSkills).map(
                                        ([category, categorySkills]) =>
                                            categorySkills.length > 0 && (
                                                <div key={category}>
                                                    <h3 className="font-medium text-lg mb-4">
                                                        {category}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categorySkills.map((skill, index) => (
                                                            <Badge
                                                                key={skill.skill_id || index}
                                                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 font-normal py-1.5 px-4 text-sm rounded-full"
                                                            >
                                                                {skill.skill_name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                    )
                                ) : (
                                    <p className="text-gray-500">
                                        No skills information available.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <Separator className="my-4 bg-gray-100" />

                    {/* Interests Section */}
                    <section
                        id="interests"
                        className="py-6"
                        ref={el => (sectionsRef.current.interests = el)}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Interests</h2>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Skeleton className="h-48 w-full rounded-2xl" />
                                <Skeleton className="h-48 w-full rounded-2xl" />
                                <Skeleton className="h-48 w-full rounded-2xl" />
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-3">
                                {/* Static interests data as there's no endpoint for interests */}
                                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-sm transition-all duration-300">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Professional Development
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Design systems, emerging UX trends, accessibility standards,
                                        and continuing education in design and technology.
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-sm transition-all duration-300">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Community & Mentorship
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Supporting emerging designers, participating in design
                                        communities, and volunteering for tech education
                                        initiatives.
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-sm transition-all duration-300">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
                                        <Heart className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Personal Hobbies</h3>
                                    <p className="text-sm text-gray-600">
                                        Photography, hiking, travel, reading design books, attending
                                        art exhibitions, and exploring new technologies.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Mobile Navigation - Fixed Bottom */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
                    <div className="flex justify-around items-center h-14">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                            <Home className="h-5 w-5 text-gray-700" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                            <Compass className="h-5 w-5 text-gray-700" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                            <User className="h-5 w-5 text-gray-700" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
