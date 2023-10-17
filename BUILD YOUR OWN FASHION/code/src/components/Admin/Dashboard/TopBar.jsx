// Topbar.jsx
import React from 'react';
import dashboardcss from "../../../assets/styles/AdminStyles/dashboard.module.css"
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate()
    const handleClick = () =>{
        localStorage.removeItem("role");
        localStorage.removeItem("user")
        localStorage.removeItem("auth_token")
        navigate('/login')
    }

    return (
        <div className={dashboardcss.topbar}>
            <div className={dashboardcss.topbar__left}>
            </div>
            <div className={dashboardcss.topbar__right}>
                {/* <div className={dashboardcss.topbar__search}>
                    <input type="text" placeholder="Search..." /> 
                    </div> */}
                <div className={dashboardcss.topbar__user}>
                    <button style={{border:"1px solid white",backgroundColor:"#004549",margin:"0 20px",padding:"10px",color:"white",borderRadius:"8px",cursor:"pointer"}} onClick={handleClick}>
                        Logout
                    </button>
                    <span>Admin</span>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
