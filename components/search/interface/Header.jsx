"use client"

import React from "react";

import { useRouter } from "next/navigation";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./styles/Header.css";

export default function Header() {

    const router = useRouter();


    return (
        <header className="chat-header">
            <div className="logo-container" onClick={() => router.push("/")}>
                {/*<div className="logo">
                    <div className="logo-circle"></div>
                    <div className="logo-line"></div>
                </div>*/}
                <span className="app-title">circl.</span>
            </div>
            <div className="header-actions">
                <Button variant="ghost" size="icon" className="header-button">
                    <Search className="icon-small" />
                </Button>
                <Button variant="ghost" size="icon" className="header-button">
                    <Download className="icon-small" />
                </Button>
                <div className="avatar">R</div>
            </div>
        </header>
    );
}
