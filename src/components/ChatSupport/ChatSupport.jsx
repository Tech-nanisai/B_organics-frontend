import React, { useState, useEffect } from "react";
import "./ChatSupport.css";
import { FaPaperclip, FaPaperPlane, FaUserCircle, FaRobot, FaTimes } from "react-icons/fa";

const ChatSupport = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(true); // NEW STATE
  const [isClosing, setIsClosing] = useState(false); // NEW STATE

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      sender: "user",
      text: inputMessage,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: "The chat support will be available very soon. Please contact us through email.",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 5000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const fileMessage = {
      sender: "user",
      file: fileUrl,
      fileName: file.name,
      fileType: file.type,
    };

    setMessages((prev) => [...prev, fileMessage]);

    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: "Thanks for sharing your file. We'll review and get back soon!",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 4000);
  };

  // 💥 Close handler with 5-second delay
  const handleClose = () => {
    setIsClosing(true); // trigger fade-out animation if needed
    setTimeout(() => {
      setShowChat(false);
    }, 5000);
  };

  if (!showChat) return null;

  return (
    <div className={`chatSupport-container ${isClosing ? "closing" : ""}`} data-aos="fade-up" data-aos-duration="100">
      <div className="chatSupport-header">
        <FaRobot className="chatSupport-robotIcon" />
        <h4>Support Chat</h4>
        <FaTimes className="chatSupport-closeIcon" onClick={handleClose} />
      </div>

      <div className="chatSupport-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatSupport-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.sender === "user" ? (
              <FaUserCircle className="chatSupport-icon" />
            ) : (
              <FaRobot className="chatSupport-icon" />
            )}
            {msg.text && <p className="chatSupport-text">{msg.text}</p>}

            {msg.file && (
              <>
                {msg.fileType.startsWith("image/") ? (
                  <img src={msg.file} alt="Shared file" className="chatSupport-shared-image" />
                ) : (
                  <a href={msg.file} download={msg.fileName} className="chatSupport-file-link">
                    📎 {msg.fileName}
                  </a>
                )}
              </>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="chatSupport-message bot">
            <FaRobot className="chatSupport-icon" />
            <p className="chatSupport-text typing">Typing...</p>
          </div>
        )}
      </div>

      <div className="chatSupport-inputArea">
        <label htmlFor="file-upload" className="chatSupport-attach">
          <FaPaperclip />
        </label>
        <input id="file-upload" type="file" style={{ display: "none" }} onChange={handleFileUpload} />
        <textarea
          rows="1"
          className="chatSupport-textarea"
          placeholder="Type your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chatSupport-sendButton" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatSupport;
