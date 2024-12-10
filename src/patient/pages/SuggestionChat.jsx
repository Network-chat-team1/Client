import React, { useState } from 'react';
import styles from './SuggestionChat.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function SuggestionChat() {
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

    return (
        <div className={styles.chatContainer}>
            <header className={styles.header}>
                <div className={styles.icon}>
                    <span className={styles.iconText}>관리자</span>
                </div>
                <div className={styles.details}>
                    <h2 className={styles.title}>건의방</h2>
                    <p className={styles.subtitle}>지내시며 불편하신 점이 있으신가요?</p>
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

export default SuggestionChat;
