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

        const wsUrl = `wss://network-chat.store/ws/doctorchat?uniqueIdentifier=${uniqueIdentifier}`;
        console.log(`WebSocket 연결 시도 (URL: ${wsUrl})`);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket 연결 성공");
            setIsConnected(true);
            setConnectionAttempts(0); // 연결 성공 시 시도 횟수 초기화
        };

        ws.current.onmessage = (event) => {
            try {
                const data = event.data;
            
                // event.data가 JSON 형식이 아닌 경우 긴급 메시지 처리로 넘기기
                if (!isJson(data)) {
                    // 긴급 메시지 처리 (EmergencyMessageHandler로 넘김)
                    EmergencyMessageHandler(data);
                    return;
                }else{
            
                // JSON 형식이라면 처리
                const parsedMessage = JSON.parse(data);
                const innerMessage = JSON.parse(parsedMessage.message);
            
                const isMyMessage = innerMessage.sender === uniqueIdentifier;
            
                const newMessage = {
                    id: parsedMessage.id || `${Date.now()}-${Math.random()}`,
                    sender: isMyMessage ? "user" : "other",
                    text: isMyMessage
                        ? innerMessage.text
                        : `${parsedMessage.sender}: ${innerMessage.text}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isEmergency: false, // 긴급 메시지가 아니므로 false
                };
            
                setMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg.id === newMessage.id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, newMessage];
                });
            }
            
            } catch (error) {
                console.error("처리 중 오류 발생:", error);
            }
        };
        
        // 긴급 메시지 처리 함수 (원본 텍스트 그대로 전송)
        const EmergencyMessageHandler = (message) => {
            const newMessage = {
                id: `${Date.now()}-${Math.random()}`,
                sender: "system", // 긴급 메시지는 시스템에서 온 것으로 처리
                text: message, // 원본 메시지 그대로
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isEmergency: true, // 긴급 메시지 표시
            };
        
            setMessages((prevMessages) => {
                if (prevMessages.some((msg) => msg.id === newMessage.id)) {
                    return prevMessages;
                }
                return [...prevMessages, newMessage];
            });
        };
        
        // JSON 형식인지 확인하는 함수
        const isJson = (data) => {
            try {
                JSON.parse(data);
                return true;
            } catch (e) {
                return false;
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
            } ${message.isEmergency ? styles.emergencyMessage : ""}`} // 긴급 메시지 스타일 적용
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