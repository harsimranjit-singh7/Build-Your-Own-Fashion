import React, { useRef, useState } from 'react'
import logincss from "../assets/styles/Login.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faShirt, faUserLarge } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [err, setErr] = useState(false);
    const alert = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state && location.state.from ? location.state.from : '/';

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.email !== "" && formData.password !== "" && formData.username !== "") {
            const data = await fetch('http://localhost:5400/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.username
                })
            })
                .then(res => res.json())
                .then(res => { return res })
                .catch(err => console.log("Internal server error", err.message));

            if (data.success) {
                localStorage.setItem("auth_token",data.authtoken)
                localStorage.setItem("user",data.user.username)
                localStorage.setItem("role","user");
                navigate(from);
            } else {
                setErr(true);
                e.target.innerHTML = "Log in";
                alert.current.innerHTML = data.error;
                setTimeout(() => {
                    setErr(false)
                }, 1500);
            }
        } else {
            setErr(true);
            e.target.innerHTML = "Log in";
            alert.current.innerHTML = "Please Provide Credentials";
            setTimeout(() => {
                setErr(false)
            }, 1500);
        }

    };

    const handleInputChange = (fieldName, value) => {
        setFormData({
            ...formData,
            [fieldName]: value
        });
    };
    return (
        <main className={logincss.main}>
            <div className={logincss.container}>
                <div className={logincss.header}>
                    <h3 style={{color:"white"}}>
                        <FontAwesomeIcon style={{ fontWeight: 900,color:"white", margin: "0 10px 0 0" }} icon={faShirt} />
                        Build Your Own Fashion
                    </h3>
                    <p>Join the world of fashion</p>
                </div>
                <div className={logincss.main_body}>
                    <form>
                        <InputElement key={"username"} type="text" onInputChange={handleInputChange} icon={faUserLarge} fieldName="username">
                            Username :
                        </InputElement>
                        <InputElement key={"email"} type="email" onInputChange={handleInputChange} icon={faEnvelope} fieldName="email">
                            Email :
                        </InputElement>
                        <InputElement key={"password"} type="password" onInputChange={handleInputChange} icon={faKey} fieldName="password">
                            Password :
                        </InputElement>
                        <button className={logincss.button} onClick={handleRegister}>Register</button>
                    </form>
                </div>
                <div className={logincss.footer}>
                    Already have an account?
                    <Link className={logincss.link} to={'/Login'} >Log in Now</Link>
                </div>
            </div>
            <div ref={alert} style={err ? { display: "block", top: "10px", transition: "top .5s ease-in", transform: "50% 50%" } : {}} className={logincss.alert}></div>
        </main>
    )
}

export default Register

const InputElement = ({ children, icon, fieldName, type, onInputChange }) => {
    const onChangeHandler = (e) => {
        const value = e.target.value;
        onInputChange(fieldName, value); // Call the function from Login component
    };
    return (
        <div className={logincss.form_group}>
            <label htmlFor={fieldName}>
                <FontAwesomeIcon icon={icon} style={{ marginRight: "5px" }} />
                {children}
            </label>
            <input type={type} id={fieldName} onChange={onChangeHandler} name={fieldName} />
        </div>
    )
}