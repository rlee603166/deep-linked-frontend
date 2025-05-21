// UserBadge.jsx
import React from "react";
import { User } from "lucide-react";

export default function UserBadge({ firstName, lastName, profilePicture }) {
    // Create display name in "FirstName L." format
    const getDisplayName = () => {
        if (firstName && lastName) {
            return `${firstName} ${lastName.charAt(0)}.`;
        } else if (firstName) {
            return firstName;
        } else if (lastName) {
            return lastName;
        }
        return "";
    };

    const getInitials = () => {
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        } else if (firstName) {
            return firstName.charAt(0).toUpperCase();
        } else if (lastName) {
            return lastName.charAt(0).toUpperCase();
        }
        return "";
    };

    // Generate background color based on name
    const generateColor = () => {
        const colors = [
            "#4338ca", // indigo-700
            "#0369a1", // sky-700
            "#15803d", // green-700
            "#b91c1c", // red-700
            "#7e22ce", // purple-700
            "#c2410c", // orange-700
            "#0f766e", // teal-700
        ];
        const nameString = `${firstName || ""}${lastName || ""}`;
        if (!nameString) return colors[0];
        const hash = nameString.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        return colors[hash % colors.length];
    };

    return (
        <div className="flex items-center bg-[#f3f4f6] rounded-full h-7 pr-3 pl-1 py-1">
            <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: profilePicture ? "#1e293b" : generateColor() }}
            >
                {profilePicture ? (
                    <img
                        src={profilePicture}
                        alt={getDisplayName() || "User"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-white text-xs font-semibold">
                        {getInitials() || <User size={12} />}
                    </span>
                )}
            </div>
            {firstName && (
                <span className="text-xs text-black font-medium ml-2 whitespace-nowrap">
                    {getDisplayName()}
                </span>
            )}
        </div>
    );
}
