import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Admin/Dashboard/SideBar';
import dashboardcss from '../../assets/styles/AdminStyles/dashboard.module.css'
import TopBar from '../../components/Admin/Dashboard/TopBar';
import OrderList from '../../components/Admin/Dashboard/OrderList';
import AchievementCards from '../../components/Admin/Dashboard/AchievmentsCards';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [orderSummary, setOrderSummary] = useState([]);
    const [achievement, setAchievement] = useState([]);
    useEffect(() => {
        const fetchSummary = () => {
            const auth_token = localStorage.getItem("auth_token");
            fetch('http://localhost:5400/api/admin/order/orderSummary', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token':auth_token
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setOrderSummary(data.data)
                        // console.log('Order Summaries:', data.data);
                    } else {
                        console.error('Error fetching order summaries:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Network or server error:', error.message);
                });
        }
        fetchSummary();



        /*fetching dashboard stats */
        const fetchDashboardStats = async () => {
            try {
                const response = await fetch('http://localhost:5400/api/admin/order/dashboardStats');
                const data = await response.json();
        
                if (data.success) {
                    const { totalUsers, totalOrders, placedOrders, pendingOrders } = data.stats;

                    setAchievement([
                        {
                            label: 'Total Users:',
                            value: totalUsers
                        },
                        {
                            label: 'Placed Orders:',
                            value: placedOrders
                        },
                        {
                            label: 'Total Orders:',
                            value: totalOrders
                        },
                        {
                            label: 'Orders Pending',
                            value: pendingOrders
                        },
                    ])

                } else {
                    console.error("Failed to fetch stats:", data.message);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        
        // Call the function
        fetchDashboardStats();
        

    }, []);



    const achievementsData = [
        {
            label: 'Users Registered',
            value: 5000
        },
        {
            label: 'Orders Placed',
            value: 2500
        },
        {
            label: 'Orders Pending',
            value: 10000
        }
    ];
    const isAdmin = localStorage.getItem("role");
    return (
        <>
            {
                isAdmin === "admin" ?
                    orderSummary.length === 0?
                    <div style={{width:"100%",height:"100vh",display:"flex",alignItems:"center"}}>
                        <div style={{margin:"auto",textAlign:"center"}}>Loading....</div>
                    </div>
                    :
                    <div className={dashboardcss.app_container}>
                        <Sidebar />
                        <div className={dashboardcss.main_content}>
                            <TopBar />
                            {/* Rest of your app content goes here */}
                            <div>
                                <h1>Achievements</h1>
                                <AchievementCards achievements={achievement} />
                            </div>
                            <OrderList orders={orderSummary} />
                        </div>
                    </div>
                    :
                    <>
                        {navigate('/login')}
                    </>
            }
        </>
    )
}
