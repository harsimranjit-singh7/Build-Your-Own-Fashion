import React, { useRef, useState } from 'react'
import logincss from "../assets/styles/Login.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faShirt, faUserLarge } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [err, setErr] = useState(false);
    const alert = useRef(null);
    const navigate = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        e.target.innerHTML = "Loading...";
        console.log(formData)
        if (formData.email !== "" && formData.password !== "") {
            const data = await fetch('http://localhost:5400/api/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })
                .then(res => res.json())
                .then(res => { return res })
                .catch(err => console.log("Internal server error", err.message));

            if (data.success) {
                localStorage.setItem("auth_token",data.authtoken)
                localStorage.setItem("user",data.user.username)
                localStorage.setItem("role",data.role);
                if(data.role === "user"){
                    navigate("/");
                }else if(data.role === "admin"){
                    navigate("/admin/Dashboard")
                }
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
                    <h3>
                        <FontAwesomeIcon style={{ fontWeight: 900, margin: "0 10px 0 0" }} icon={faShirt} />
                        Build Your Own Fashion
                    </h3>
                    <p>Enter the world of Fashion</p>
                </div>
                <div className={logincss.main_body}>
                    <form name="form_login">
                        <InputElement icon={faUserLarge} type={"text"} onInputChange={handleInputChange} fieldName="email">
                            Email :
                        </InputElement>
                        <InputElement icon={faKey} type={"password"} onInputChange={handleInputChange} fieldName="password">
                            Password :
                        </InputElement>
                        <button className={logincss.button} onClick={loginHandler}>Log in</button>
                    </form>
                </div>
                <div className={logincss.footer}>
                    New to Build Your own Fashion?
                    <Link className={logincss.link} to={'/Register'} >Register Now</Link>
                </div>
            </div>
            <div ref={alert} style={err ? { display: "block", top: "10px", transition: "top .5s ease-in", transform: "50% 50%" } : {}} className={logincss.alert}></div>
        </main>
    )
}


export default Login

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