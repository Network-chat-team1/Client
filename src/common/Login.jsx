import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router 사용
import styles from './Login.module.css';
import logo from './img/Hospital.png';

function Login() {
    const [category, setCategory] = useState(''); // 환자/의료진 카테고리 선택 상태
    const [id, setId] = useState(''); // 고유 식별 번호 상태
    const [password, setPassword] = useState(''); // 비밀번호 상태
    const navigate = useNavigate(); // React Router 네비게이션

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category || !id || !password) {
            alert('사용자 유형, 식별 번호, 비밀번호를 모두 입력해주세요.');
            return;
        }

        try {
            // API 요청 (프록시를 활용한 상대 경로)
            const response = await fetch(`/api/login?uniqueIdentifier=${id}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('로그인 실패! 사용자 정보를 확인해주세요.');
            }

            const data = await response.text(); // 응답이 텍스트인 경우
            alert(data); // 로그인 성공 메시지 표시

            // 선택된 카테고리에 따라 라우팅
            if (category === 'patient') {
                navigate('/patient/home'); // 환자 페이지로 이동
            } else if (category === 'doctor') {
                navigate('/doctor/home'); // 의료진 페이지로 이동
            } else {
                alert('유효하지 않은 사용자 유형입니다.');
            }
        } catch (error) {
            console.error(error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.frame}>
            <img src={logo} alt="Hospital Logo" />
            <h1>로그인</h1>
            <p>안녕하세요, 저희 서비스의 사용을 위해서는 <br />먼저 로그인해주시기 바랍니다.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="category">사용자 유형</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">사용자 유형 선택</option>
                        <option value="patient">환자</option>
                        <option value="doctor">의료진</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="id">고유 식별 번호</label>
                    <input
                        type="text"
                        id="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className={styles.input}
                        placeholder="고유 식별 번호를 입력하세요"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>
                <button type="submit" className={styles.button}>
                    로그인
                </button>
            </form>
        </div>
    );
}

export default Login;
