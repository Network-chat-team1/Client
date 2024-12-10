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

    // 환자 이름을 여기에 추가할 수 있음 (예: "민서")
    const [patientName, setPatientName] = useState(prefix);

    const handleEmergencyCall = async () => {
        try {
            // POST 요청 보내기
            const response = await axios.post('http://3.39.185.125:8080/api/emergency/api/call', null, {
                params: {
                    patientName: patientName
                }
            });
            alert(response.data); // 서버로부터 받은 응답 메시지 출력
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
