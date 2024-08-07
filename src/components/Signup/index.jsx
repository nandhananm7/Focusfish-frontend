import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.css';


const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const url = "https://focusfish-backend.onrender.com/api/users";
            const { data: res } = await axios.post(url, data);
            navigate("/login");
            console.log(res.message);
        } catch (error) {
            if ((error.response) && (error.response.status>=400) && (error.response.status<=500))
                setError(error.response.data.message)
        }
    }

    return (
        <div>
        <header>
            <h1>FocusFish <Link to="/login"><button className={styles.header_button}>Log in</button></Link></h1>
        </header>
            <div className = {styles.signup_container}>
            <div className = {styles.signup_from_container}>
                
                <div className = {styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit} >
                        <h1>Create an Account</h1>
                        <input 
                            type = "text" 
                            placeholder='First Name'
                            name ='firstName'
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className={styles.input}
                        />
                        <input 
                            type = "text" 
                            placeholder='Last Name'
                            name ='lastName'
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className={styles.input}
                        />
                        <input 
                            type = "email" 
                            placeholder='Email'
                            name ='email'
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input 
                            type = "password" 
                            placeholder='Password'
                            name ='password'
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>Sign Up!</button>
                    </form>
                </div>
                <div className = {styles.left}>
                    <h3> Have an account already? </h3>
                    <Link to="/login">
                    <button type='button' className={styles.white_btn}> Log in </button>
                    </Link>
                </div>
            </div>
        </div>
        </div>
    )
};

export default Signup;
