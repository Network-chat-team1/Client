import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatScreen.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function ChatScreen() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const maxReconnectAttempts = 5;
    const reconnectInterval = useRef(3000);
    const ws = useRef(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id'); // id 값 가져오기
    const uniqueIdentifier = id; // 사용자 고유 식별자

    const connectWebSocket = () => {
        if (connectionAttempts >= maxReconnectAttempts) {
            console.error("재연결 시도 제한 초과");
            return;
        }

        const wsUrl = `ws://3.39.185.125:8080/ws/doctorchat?uniqueIdentifier=${uniqueIdentifier}`;
        console.log(`WebSocket 연결 시도 (URL: ${wsUrl})`);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket 연결 성공");
            setIsConnected(true);
            setConnectionAttempts(0); // 연결 성공 시 시도 횟수 초기화
        };

        ws.current.onmessage = (event) => {
            try {
                // 첫 번째 JSON 파싱
                const parsedMessage = JSON.parse(event.data);

                // 중첩된 message 필드를 다시 파싱
                const innerMessage = JSON.parse(parsedMessage.message);

                // 서버에서 받은 메시지가 내가 보낸 메시지인지 확인
                const isMyMessage = innerMessage.sender === uniqueIdentifier;

                const newMessage = {
                    id: parsedMessage.id || `${Date.now()}-${Math.random()}`, // 고유 ID 생성
                    sender: isMyMessage ? "user" : "other",
                    text: isMyMessage
                        ? innerMessage.text // 내가 보낸 메시지는 내용만 표시
                        : `${parsedMessage.sender}: ${innerMessage.text}`, // 남이 보낸 메시지는 이름 + 내용 표시
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };

                // 중복 확인 후 상태 업데이트
                setMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg.id === newMessage.id)) {
                        return prevMessages; // 중복 메시지 무시
                    }
                    return [...prevMessages, newMessage];
                });
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
                console.error("수신된 메시지:", event.data);
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
        if (!input.trim()) return; // 빈 메시지 필터링

        // 서버로 전송할 메시지 생성
        const messageToSend = {
            text: input,
            sender: uniqueIdentifier, // 고유 식별자를 포함
        };

        // WebSocket을 통해 메시지 전송
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(messageToSend));
        } else {
            console.error("WebSocket이 열려있지 않습니다. 메시지를 전송할 수 없습니다.");
        }

        // 입력 필드 초기화
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
                        {isConnected ? "연결됨" : `연결 중...`}
                    </p>
                </div>
            </header>
            <div className={styles.chatBody}>
                {messages.map((message) => (
                    <div
                        key={message.id} // 고유한 id를 사용하여 중복 방지
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
