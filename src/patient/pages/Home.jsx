import React from "react";
import styles from './Home.module.css';
import NavBar from "../components/NavBar";
import ButtonImage from "../img/iOS Emergency 3D Button (HD).png";
import { useLocation } from 'react-router-dom';


function Home() {
    // const userName = "민서"; // 예제 사용자 이름
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prefix = queryParams.get('prefix'); 
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.greeting}><span>{prefix}</span>님, 안녕하세요!</h1>
            </header>
            <main className={styles.mainContent}>
                <button className={styles.emergencyButton}>
                    <img src={ButtonImage} />
                </button>
            </main>
            <NavBar />
        </div>
    );
}

export default Home;
