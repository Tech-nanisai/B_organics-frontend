import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "./DarkToggle.css";

const DarkToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark" ||
            (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <button
            className={`DarkToggle-btn ${isDark ? 'is-dark' : 'is-light'}`}
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Dark Mode"
        >
            <div className="DarkToggle-track">
                <div className="DarkToggle-thumb">
                    {isDark ? <FaMoon className="DarkToggle-icon" /> : <FaSun className="DarkToggle-icon" />}
                </div>
            </div>
        </button>
    );
};

export default DarkToggle;
