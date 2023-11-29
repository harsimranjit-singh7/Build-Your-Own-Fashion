import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import appcss from '../../assets/styles/App.module.css';
import { Alert } from '../Alert'

const NavBar = () => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState("");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    
    useEffect(() => {
        if(role === "admin"){
            navigate('/login')
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            localStorage.removeItem("auth_token");
        }
      }, [])
    const [orderPendingCount, setOrderPendingCount] = useState(0);
    const username = localStorage.getItem('user');
    const location = useLocation();
    const logoutHandler = () => {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user");
        navigate('/login')
    }
    const user = localStorage.getItem("user")


    
    useEffect(() => {
        const user = localStorage.getItem("user")
        if(user){
            const fetchCount = () => {
                const auth_token = localStorage.getItem("auth_token");
                fetch(`http://localhost:5400/api/order/pendingCount`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                        "auth_token":auth_token
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Failed to fetch pending orders count");
                        }
                    })
                    .then(data => {
                        setOrderPendingCount(data.pendingOrdersCount);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }
    
            fetchCount();
        }   
    }, []);


    return (
        <nav className={appcss.nav}>
            <Link to={"/"}>
                <img style={{ width: "150px" }} src={logo} alt='Logo' />
            </Link>
            <div className={appcss.nav_links}>
                <ul>
                    {
                        user?
                        <li>Welcome, {username}</li>
                        :
                        <></>
                    }
                    {/* <li>
                        <Link to={"/Login"}>
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link to={"/Register"}>
                            Register
                        </Link>
                    </li> */}
                    {
                        user?
                        <button
                            onClick={logoutHandler}
                            style={{ backgroundColor: "#004945", color: "white", padding: "3px 20px", margin: "-10px 0", cursor: "pointer", border: "none", borderRadius: "5px", fontWeight: 600, fontSize: "small" }}
                            type='button'>
                        Logout
                        </button>
                    :
                    <>
                    <button
                        onClick={()=>navigate('/Login', { state: { from: location.pathname } })}
                        style={{ backgroundColor: "#004945", color: "white", padding: "3px 20px", margin: "-10px 0", cursor: "pointer", border: "none", borderRadius: "5px", fontWeight: 600, fontSize: "small" }}
                        type='button'>
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/Register', { state: { from: location.pathname } })}
                        style={{ border: "1px solid #004945", color: "#004945", padding: "3px 20px", margin: "-10px 0", cursor: "pointer", borderRadius: "5px", fontWeight: 600, fontSize: "small" }}
                        type='button'>
                        Register
                    </button>
                    </>
                    }
                    
                    <li className={appcss.nav_item}>
                        <Link to={'/Cart'}>
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span>{orderPendingCount}</span>
                        </Link>
                    </li>
                </ul>
                <button className={appcss.button}>
                    <FontAwesomeIcon size={"lg"} icon={faBars} />
                </button>
            </div>
            <Alert visible={visible} data={data}/>
        </nav>
    )
}

export default NavBar