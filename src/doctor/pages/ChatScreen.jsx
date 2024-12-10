import React, { useState } from 'react';
import styles from './ChatScreen.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function ChatScreen() {
    const navigate = useNavigate(); // 네비게이션 사용

    const [messages, setMessages] = useState([
        { id: 1, sender: "server", text: "We can have that ready for you in about 30-40 minutes. Would you like to proceed with the order?", time: "02:58 PM" },
        { id: 2, sender: "user", text: "I'm thinking about getting a large pepperoni pizza and some garlic bread.", time: "02:59 PM" },
    ]);

    const [input, setInput] = useState("");

    const handleSendMessage = () => {
        if (input.trim() === "") return;

        const newMessage = {
            id: messages.length + 1,
            sender: "user",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInput("");
    };

    const handleBackClick = () => {
        navigate("/doctor/home"); // 'doctor/home' 경로로 이동
    };
    return (
        <div className={styles.chatContainer}>
            <header className={styles.header}>
                <button onClick={handleBackClick} >
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" style={{color: "gray",}} />
                </button>
                <div className={styles.icon}>
                    <span className={styles.iconText}>의료진</span>
                </div>
                <div className={styles.details}>
                    <h2 className={styles.title}>의료진 채팅방</h2>
                    <p className={styles.subtitle}>서로를 존중하며 예의있는 소통 부탁드립니다</p>
                </div>
            </header>
            <div className={styles.chatBody}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${message.sender === "user" ? styles.userMessage : styles.serverMessage}`}
                    >
                        <p className={styles.text}>{message.text}</p>
                        <span className={styles.time}>{message.time}</span>
                    </div>
                ))}
            </div>
            <footer className={styles.footer}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className={styles.sendButton} onClick={handleSendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} size="lg" style={{color: "white",}} />
                </button>
            </footer>
        </div>
    );
}

export default ChatScreen;
