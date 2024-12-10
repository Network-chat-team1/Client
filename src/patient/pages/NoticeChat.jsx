import React, { useEffect, useRef, useState } from 'react';
import styles from './NoticeChat.module.css';
import NavBar from '../components/NavBar';

function NoticeChat() {
    const [messages, setMessages] = useState([]); // 공지 메시지를 저장할 상태
    const ws = useRef(null); // WebSocket 객체를 저장할 Ref
//hello
    useEffect(() => {
        // WebSocket 연결
        ws.current = new WebSocket('wss://network-chat.store/ws/announcements');

        ws.current.onopen = () => {
            console.log("WebSocket 연결 성공");
        };

        ws.current.onmessage = (event) => {
            try {
                const receivedMessage = event.data;
                const newMessage = {
                    id: Date.now(), // 고유 ID 생성
                    sender: "공지방",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    text: receivedMessage,
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } catch (error) {
                console.error("메시지 처리 중 오류 발생:", error);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        return () => {
            if (ws.current) {
                ws.current.close(); // 컴포넌트 언마운트 시 WebSocket 연결 종료
            }
        };
    }, []);

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
