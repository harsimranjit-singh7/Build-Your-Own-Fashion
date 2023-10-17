import React, { useEffect, useState } from 'react'
import styles from '../../assets/styles/AdminStyles/users.module.css';
import { Link } from 'react-router-dom';
import SideBar from '../../components/Admin/Dashboard/SideBar';
import TopBar from '../../components/Admin/Dashboard/TopBar';


export const User = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchSummary = () => {
            const auth_token = localStorage.getItem("auth_token");
            fetch('http://localhost:5400/api/admin/user/userSummary', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token': auth_token
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setUsers(data.data);
                        console.log('User Summaries:', data.data);
                    } else {
                        console.error('Error fetching order summaries:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Network or server error:', error.message);
                });
        }
        fetchSummary();
    }, []);


    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())) || [];
    const isAdmin = localStorage.getItem("role");

    const onRemove = (user_id) => {
        fetch(`http://localhost:5400/api/admin/user/removeUser/${user_id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.message);
                    setUsers(users.filter((e) => { return e.user_id !== user_id }));
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => {
                console.error('There was an error removing the user:', error);
            });
    }

    return (
        <>
            {
                isAdmin === "admin" ?
                    users.length === 0?
                    <div style={{width:"100%",height:"100vh",display:"flex",alignItems:"center"}}>
                        <div style={{margin:"auto",textAlign:"center"}}>Loading....</div>
                    </div>
                    :
                    <div className={styles.app_container}>
                        <SideBar />
                        <div className={styles.main_content}>
                            <TopBar />
                            {/* Rest of your app content goes here */}
                            <div style={{ margin: "100px 20px" }}>
                                <div className={styles.search_bar}>
                                    <input
                                        className={styles.search_input}
                                        type="text"
                                        placeholder="Search users using username..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className={styles.user_list}>
                                    {filteredUsers.map(user => (
                                        <div key={user.user_id} className={styles.user_card}>
                                            <div className={styles.details}>
                                                <span><strong>User ID:</strong> {user.username}</span>
                                                <span><strong>Username:</strong> {user.username}</span>
                                                <span><strong>Email:</strong> {user.email}</span>
                                                <span><strong>Pending Orders:</strong> {user.pendingOrders}</span>
                                                <span><strong>No. of Total Orders:</strong> {user.numberOfTotalOrders}</span>
                                            </div>
                                            <button className={styles.remove_btn} onClick={() => onRemove(user.user_id)}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    );
}
