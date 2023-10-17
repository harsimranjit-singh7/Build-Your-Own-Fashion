// Sidebar.jsx
import React from 'react';
import dashboardcss from '../../../assets/styles/AdminStyles/dashboard.module.css';
import { Link } from 'react-router-dom';
import logo from "../../../assets/images/logo.png"

const SideBar = () => {
    return (
        <div className={dashboardcss.sidebar}>
            <div className={dashboardcss.sidebar__brand}>
                <img style={{width:"200px"}} src={logo} alt='logo'/>
            </div>
            <div className={dashboardcss.sidebar__menu}>
                <Link to={"/admin/Dashboard"}>Dashboard</Link>
                <Link to={"/admin/Products"}>Products</Link>
                <Link to={"/admin/Users"}>Users</Link>
            </div>
        </div>
    );
}

export default SideBar;
