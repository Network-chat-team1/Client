import React, { useState } from "react";
import styles from './Home.module.css';
import NavBar from "../components/NavBar";
import ButtonImage from "../img/iOS Emergency 3D Button (HD).png";
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // axios 임포트

function Home() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prefix = queryParams.get('prefix'); 

    const [patientName, setPatientName] = useState(prefix);

    const handleEmergencyCall = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: `https://network-chat.store/api/emergency/api/call`, // URL 그대로 사용
                params: { patientName: patientName }, // patientName을 직접 전달
                paramsSerializer: (params) => {
                    const queryString = new URLSearchParams(params).toString();
                    return decodeURIComponent(queryString); // 한글 문자열 디코딩
                }
            });
            alert(response.data); // 서버 응답 메시지 출력
        } catch (error) {
            console.error("비상 호출 오류:", error);
            alert("비상 호출에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.greeting}><span>{prefix}</span>님, 안녕하세요!</h1>
            </header>
            <main className={styles.mainContent}>
                <button className={styles.emergencyButton} onClick={handleEmergencyCall}>
                    <img src={ButtonImage} alt="Emergency Button" />
                </button>
            </main>
            <NavBar />
        </div>
    );
}

export default Home;
