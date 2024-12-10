import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatScreen.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리

function ChatScreen() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const maxReconnectAttempts = 5;
    const reconnectInterval = useRef(3000);
    const ws = useRef(null);

    // 사용자 고유 식별자 생성
    const uniqueIdentifier = useRef(uuidv4()); // UUID 생성

    const connectWebSocket = () => {
        if (connectionAttempts >= maxReconnectAttempts) {
            console.error("재연결 시도 제한 초과");
            return;
        }

        const wsUrl = `ws://3.39.185.125:8080/ws/doctorchat?uniqueIdentifier=${uniqueIdentifier.current}`;
        console.log(`WebSocket 연결 시도 (URL: ${wsUrl})`);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket 연결 성공");
            setIsConnected(true);
            setConnectionAttempts(0); // 연결 성공 시 시도 횟수 초기화
        };

        ws.current.onmessage = (event) => {
            try {
                const receivedMessage = JSON.parse(event.data);

                // 내가 보낸 메시지가 아닐 경우에만 추가
                if (receivedMessage.sender !== uniqueIdentifier.current) {
                    const newMessage = {
                        id: messages.length + 1,
                        sender: "other", // 다른 사용자 메시지
                        text: receivedMessage.text, // JSON의 text 필드만 가져오기
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };

                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
                console.error("수신된 메시지:", event.data);

                const newMessage = {
                    id: messages.length + 1,
                    sender: "other",
                    text: event.data, // 원문 데이터를 그대로 표시
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };

                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket 연결 종료");
            setIsConnected(false);
            setConnectionAttempts((prev) => prev + 1);

            if (connectionAttempts < maxReconnectAttempts) {
                setTimeout(() => {
                    reconnectInterval.current = Math.min(reconnectInterval.current * 2, 30000); // 최대 30초
                    connectWebSocket();
                }, reconnectInterval.current);
            }
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
            sender: "user", // 현재 사용자
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                text: input,
                sender: uniqueIdentifier.current, // 클라이언트의 고유 식별자를 포함
            }));
        } else {
            console.error("WebSocket이 열려있지 않습니다. 메시지를 전송할 수 없습니다.");
        }

        setInput("");
    };

    const handleBackClick = () => {
        navigate("/doctor/home");
    };

    return (
        <div className={styles.chatContainer}>
            <header className={styles.header}>
                <button onClick={handleBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" style={{ color: "gray" }} />
                </button>
                <div className={styles.icon}>
                    <span className={styles.iconText}>의료진</span>
                </div>
                <div className={styles.details}>
                    <h2 className={styles.title}>의료진 채팅방</h2>
                    <p className={styles.subtitle}>
                        {isConnected ? "연결됨" : `연결 중... (시도: ${connectionAttempts})`}
                    </p>
                </div>
            </header>
            <div className={styles.chatBody}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${
                            message.sender === "user" ? styles.userMessage : styles.otherMessage
                        }`}
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

export default ChatScreen;
