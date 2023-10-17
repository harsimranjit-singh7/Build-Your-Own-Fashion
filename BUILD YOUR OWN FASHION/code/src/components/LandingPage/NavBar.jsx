import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import appcss from '../../assets/styles/App.module.css';

const NavBar = () => {
    const [orderPendingCount, setOrderPendingCount] = useState(0);
    const username = localStorage.getItem('user');
    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user");
        navigate('/login')
    }

    useEffect(() => {

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
    }, []);


    return (
        <nav className={appcss.nav}>
            <Link to={"/"}>
                <img style={{ width: "150px" }} src={logo} alt='Logo' />
            </Link>
            <div className={appcss.nav_links}>
                <ul>
                    <li>Welcome, {username}</li>
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
                    <button
                        onClick={logoutHandler}
                        style={{ backgroundColor: "#004945", color: "white", padding: "3px 20px", margin: "-10px 0", cursor: "pointer", border: "none", borderRadius: "5px", fontWeight: 600, fontSize: "small" }}
                        type='button'>
                        Logout
                    </button>
                    <li className={appcss.nav_item}>
                        <Link to={"/Cart"}>
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span>{orderPendingCount}</span>
                        </Link>
                    </li>
                </ul>
                <button className={appcss.button}>
                    <FontAwesomeIcon size={"lg"} icon={faBars} />
                </button>
            </div>
        </nav>
    )
}

export default NavBar