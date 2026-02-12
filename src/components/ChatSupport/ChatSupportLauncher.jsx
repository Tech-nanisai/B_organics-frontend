import React, { useState, useEffect } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import ChatSupport from "./ChatSupport";
import "./ChatSupport.css";

const ChatSupportLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ChatSupport-launcher">
      {isOpen && <ChatSupport onClose={() => setIsOpen(false)} />}

      <button
        className={`ChatSupport-toggleBtn ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
        {!isOpen && <span className="ChatSupport-pulse"></span>}
      </button>
    </div>
  );
};

export default ChatSupportLauncher;
