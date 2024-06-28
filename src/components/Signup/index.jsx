import styles from './styles.module.css';
import { Link,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import ParticlesComponent from '../Main/particles';

const Signup = () => {
    
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({currentTarget:input}) => {
        setData({...data,[input.name]:input.value})
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try
        { 
            const url = "https://social-media-app-backend-rho.vercel.app/signup";
            const res  = await axios.post(url, data);
            navigate("/login")
            console.log(res.message);
        } catch (error) {
            if (error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }

    }

    return (
        <div className={styles.signup_container}>
            <ParticlesComponent id="particles" />
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type='button' className={styles.white_btn}>SignIn</button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <div className={styles.form_container}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder='First Name'
                            name='firstName'
                            onChange={handleChange}
                            value={data.firstName}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder='Last Name'
                            name='lastName'
                            onChange={handleChange}
                            value={data.lastName}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder='Email'
                            name='email'
                            onChange={handleChange}
                            required
                            value={data.email}
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder='Password'
                            name='password'
                            required
                            onChange={handleChange}
                            value={data.password}
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{ error}</div> }
                        <button type="submit" className={styles.green_btn} onClick={handleSubmit}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Signup;
