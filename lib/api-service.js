// api-service.js
const API_URL =
    "http://127.0.0.1:8000" || "http://localhost:8000" || process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches user profile information
 * @param {number} userId - The user's ID
 * @returns {Promise} - Promise resolving to user data
 */
export const fetchUserProfile = async userId => {
    try {
        const response = await fetch(`${API_URL}/search/vector`);
        if (!response.ok) {
            throw new Error(`Error fetching user profile: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        return data[2];
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        throw error;
    }
};

/**
 * Fetches user experiences
 * @param {number} userId - The user's ID
 * @returns {Promise} - Promise resolving to experience data
 */
export const fetchUserExperiences = async userId => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/experiences`);
        if (!response.ok) {
            throw new Error(`Error fetching experiences: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user experiences:", error);
        throw error;
    }
};

/**
 * Fetches user education
 * @param {number} userId - The user's ID
 * @returns {Promise} - Promise resolving to education data
 */
export const fetchUserEducation = async userId => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/education`);
        if (!response.ok) {
            throw new Error(`Error fetching education: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user education:", error);
        throw error;
    }
};

/**
 * Fetches user projects
 * @param {number} userId - The user's ID
 * @returns {Promise} - Promise resolving to project data
 */
export const fetchUserProjects = async userId => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/projects`);
        if (!response.ok) {
            throw new Error(`Error fetching projects: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user projects:", error);
        throw error;
    }
};

/**
 * Fetches user skills
 * @param {number} userId - The user's ID
 * @returns {Promise} - Promise resolving to skill data
 */
export const fetchUserSkills = async userId => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/skills`);
        if (!response.ok) {
            throw new Error(`Error fetching skills: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user skills:", error);
        throw error;
    }
};

/**
 * Fetches all user data in parallel
 * @param {number} userId - The user's ID
 * @returns {Promise} - Promise resolving to all user data
 */
export const fetchAllUserData = async userId => {
    try {
        const [profile, experiences, education, projects, skills] = await Promise.all([
            fetchUserProfile(userId),
            fetchUserExperiences(userId),
            fetchUserEducation(userId),
            fetchUserProjects(userId),
            fetchUserSkills(userId),
        ]);

        return {
            profile,
            experiences,
            education,
            projects,
            skills,
        };
    } catch (error) {
        console.error("Failed to fetch all user data:", error);
        throw error;
    }
};
