// Sidebar.jsx
import React from 'react';
import dashboardcss from '../../../assets/styles/AdminStyles/dashboard.module.css';
import { Link } from 'react-router-dom';
import logo from "../../../assets/images/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';

const SideBar = () => {
    return (
        <div className={dashboardcss.sidebar}>
            <div style={{width:"250px"}} className={dashboardcss.sidebar__brand}>
                    <h3 style={{width:"300px",color:"white",paddingBottom:"13px",zIndex:"15",paddingLeft:"15px"}}>
                        <FontAwesomeIcon style={{ fontWeight: 900,color:"white", margin: "0 10px 0 0" }} icon={faShirt} />
                        Build Your Own Fashion
                    </h3>
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
