import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './Home.module.css';

function Home() {
    const userName = "민서"; // 예제 사용자 이름
    const navigate = useNavigate(); // React Router의 useNavigate 훅

    const handleChatNavigation = () => {
        navigate("/doctor/chat");
    };

    const handleHealthNavigation = () => {
        navigate("/doctor/chart");
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.greeting}><span>{userName}</span>님, 안녕하세요!</h1>
            </header>
            <main className={styles.mainContent}>
                <button className={styles.chatButton} onClick={handleChatNavigation}>
                    의료진 채팅
                </button>
                <button className={styles.healthButton} onClick={handleHealthNavigation}>
                    환자 건강 체크
                </button>
            </main>
        </div>
    );
}

export default Home;
