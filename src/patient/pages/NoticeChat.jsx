import React from 'react';
import styles from './NoticeChat.module.css';
import NavBar from '../components/NavBar';

function NoticeChat() {
    // Mock 데이터
    const messages = [
        { id: 1, sender: "공지방", time: "02:58 PM", text: "Hi! Thanks for reaching out. What can I get for you?" },
        { id: 2, sender: "공지방", time: "02:58 PM", text: "We can have that ready for you in about 30-40 minutes. Would you like to proceed with the order?" },
        { id: 3, sender: "공지방", time: "02:58 PM", text: "We can have that ready for you in about 30-40 minutes. Would you like to proceed with the order?" },
        { id: 4, sender: "공지방", time: "02:58 PM", text: "We can have that ready for you in about 30-40 minutes. Would you like to proceed with the order?" },
    ];

    return (
        <div className={styles.chatContainer}>
            <header className={styles.header}>
                <div className={styles.icon}>
                    <span className={styles.iconText}>관리자</span>
                </div>
                <div className={styles.details}>
                    <h2 className={styles.title}>공지방</h2>
                    <p className={styles.subtitle}>공지채널에 오신 것을 환영합니다!</p>
                </div>
            </header>
            <div className={styles.chatBody}>
                {messages.map((message) => (
                    <div key={message.id} className={styles.message}>
                        <p className={styles.text}>{message.text}</p>
                        <span className={styles.time}>{message.time}</span>
                    </div>
                ))}
            </div>
            <NavBar />
        </div>
    );
}

export default NoticeChat;
