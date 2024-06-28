import styles from './styles.module.css';
import { Link } from 'react-router-dom';

// need to make a collapsible sidebar for this page (and all other nested pages)

const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.reload();
    };

    const username = localStorage.getItem('username');

    return (
        <div>
         <header>
            <h1>FocusFish <button className={styles.white_btn} onClick={handleLogout}>Log out</button></h1> 
        </header>   
        <h2 className={styles.welcome_msg}>Welcome {username}!</h2>
        <p className={styles.tagline}>Keep your Focus, Fish for Success</p>
        <div className={styles.main_container}>
        <Link to="/Todo"><button className={styles.button1}>ToDo</button></Link> 
        <Link to="/Pomodoro"><button className={styles.button2}>Pomodoro</button></Link> 
        <button className={styles.button3}>Calendar</button>
        <button className={styles.button4}>My Stats</button>
        <button className={styles.button5}>Aquarium</button> 
        <button className={styles.button6}>Help</button>
        </div>
        </div>
    )
}

export default Main;