import React from "react";
import Chart from "../components/Chart";
import styles from "./PatientChart.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from "react-router-dom";

function PatientChart() {
    const navigate = useNavigate(); // 네비게이션 사용

    // Mock 데이터: 환자 이름, 병명, 지정 의사
    const patients = [
        {
            name: "김민수",
            condition: "고혈압",
            doctor: "Dr. 이철수", // 지정 의사
        },
        {
            name: "박영희",
            condition: "당뇨병",
            doctor: "Dr. 김영진", // 지정 의사
        },
        {
            name: "이정호",
            condition: "심부전",
            doctor: "Dr. 박정민", // 지정 의사
        }
    ];

    const handleBackClick = () => {
        navigate("/doctor/home"); // 'doctor/home' 경로로 이동
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={handleBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" style={{ color: "#1455B0" }} />
                </button>
                <h1 className={styles.title}>환자 차트 목록</h1>
                <div></div>
            </div>
            <div className={styles.chartList}>
                {/* Mock 데이터를 map을 이용해 Chart 컴포넌트로 전달 */}
                {patients.map((patient, index) => (
                    <Chart
                        key={index}
                        name={patient.name} // 환자 이름
                        condition={patient.condition} // 병명
                        doctor={patient.doctor} // 지정 의사
                    />
                ))}
            </div>
        </div>
    );
}

export default PatientChart;
