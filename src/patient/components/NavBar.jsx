import styles from './NavBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHouse, faFeather } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function NavBar () {
    const navigate = useNavigate();
    return(
        <>
            <footer className={styles.bottom_navigation}>
                <button className={styles.navButton} onClick={() => navigate('/patient/notice-chat')} ><FontAwesomeIcon icon={faComments} size="lg" style={{color: "#C7D2D8",}} /></button>
                <button className={styles.navButton} onClick={() => navigate('/patient/home')} ><FontAwesomeIcon icon={faHouse} size="lg" style={{color: "#C7D2D8",}} /></button>
                <button className={styles.navButton} onClick={() => navigate('/patient/suggestion-chat')} ><FontAwesomeIcon icon={faFeather} size="lg" style={{color: "#C7D2D8",}} /></button>
            </footer>
        </>
    )
}

export default NavBar;