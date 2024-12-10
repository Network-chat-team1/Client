import React, { useState, useEffect, useRef } from 'react';
import styles from './SuggestionChat.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function SuggestionChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null); // WebSocket 객체
    const reconnectInterval = useRef(3000); // 초기 재연결 간격

    const connectWebSocket = () => {
        // 이미 WebSocket이 열려있으면 연결하지 않음
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log("WebSocket이 이미 열려있습니다.");
            return;
        }

        ws.current = new WebSocket('ws://3.39.185.125:8080/ws/suggestions');

        ws.current.onopen = () => {
            console.log("WebSocket 연결 성공");
            setIsConnected(true);
            reconnectInterval.current = 3000; // 재연결 간격 초기화
        };

        ws.current.onmessage = (event) => {
            console.log("서버 메시지 수신:", event.data);
            const serverMessage = JSON.parse(event.data); // 서버에서 JSON 데이터 수신
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: prevMessages.length + 1,
                    sender: "server",
                    text: serverMessage.text,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket 연결 종료. 재연결 시도...");
            setIsConnected(false);

            // 점진적 재연결 간격 증가 (최대 30초)
            reconnectInterval.current = Math.min(reconnectInterval.current * 2, 30000);
            setTimeout(connectWebSocket, reconnectInterval.current);
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (input.trim() === "") return;

        const newMessage = {
            id: messages.length + 1,
            sender: "user",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMessage]);

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ text: input }));
        } else {
            console.error("WebSocket이 열려있지 않습니다. 메시지를 전송할 수 없습니다.");
        }

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
                    disabled={!isConnected}
                />
                <button
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    disabled={!isConnected}
                >
                    <FontAwesomeIcon icon={faPaperPlane} size="lg" style={{ color: "white" }} />
                </button>
            </footer>
        </div>
    );
}

export default SuggestionChat;
