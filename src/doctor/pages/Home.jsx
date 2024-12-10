import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './Home.module.css';
import { useLocation } from 'react-router-dom';

function Home() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prefix = queryParams.get('prefix'); // prefix 값 가져오기
    const id = queryParams.get('id'); // id 값 가져오기

    const navigate = useNavigate(); 

    const handleChatNavigation = () => {
        // id 값을 포함하여 /doctor/chat으로 이동
        navigate(`/doctor/chat?id=${id}`);
    };

    const handleHealthNavigation = () => {
        navigate("/doctor/chart");
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.greeting}><span>{prefix}</span>님, 안녕하세요!</h1>
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
