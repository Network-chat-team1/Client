import styles from './Chart.module.css';

function Chart({ name, condition, doctor }) {
    return (
        <div className={styles.frame}>
            <div className={styles.textInfo}>
                <p className={styles.name}>{name}</p>
                <p>상태: {condition}</p>
                <p>담당의: {doctor}</p>
            </div>
        </div>
    );
}

export default Chart;
