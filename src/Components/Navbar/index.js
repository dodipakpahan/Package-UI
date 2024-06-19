import React, { useEffect, useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { House, BoxSeam, ListTask, Hourglass, BoxArrowInLeft, Bell, HouseAdd, Power } from "react-bootstrap-icons";
import { Button } from 'react-bootstrap';
import { getNotification, readNotification } from '../../Helpers/ApplicationHelper';
import moment from 'moment';
import { Sidebar, Menu, MenuItem, SubMenu, sidebarclassNamees } from 'react-pro-sidebar';
import weblogo from "../../Assets/images/lift.png"

import { useCookies } from 'react-cookie';

function Navbar({
    pageName,
    userName,
    pageLogo,
    isOpen,
    setIsOpen
}) {
    // const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [unreadNotifcation, setUnreadNotification] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotification();
    }, [])

    useEffect(() => {
        if (notifications.length > 0) {
            let unreadCounts = notifications.filter(notification => !notification.is_read).length;
            setUnreadCount(unreadCounts)
            let displayCounts = unreadCounts > 9 ? '9+' : unreadCounts;
            setUnreadNotification(displayCounts);
        }

    }, [notifications])



    const Notification = ({ notification, markAsRead, data }) => {
        return (
            <div
                className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                onClick={(e) => {
                    console.log(data)
                    markAsRead(notification.id)
                    markAsReadNotification(data.id);
                    if (data.path === null) {
                        navigate("/Package/Detail", { state: { packageId: data.package_id } })
                    }else{
                        navigate(`${data.path}`, {state:{stepId:data.package_step_id, packageId: data.package_id}})
                    }
                }

                }
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%"
                }}>
                    <div>{notification.note}</div>
                    <div style={{display:"flex",justifyContent:"flex-end", fontSize:12}}> {moment(notification.created_date).format("DD-MM-yyyy")}</div>
                   
                </div>

            </div>
        );
    };

    const markAsRead = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, is_read: true } : notification
            )
        );
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };



    const handleLogout = () => {
        removeCookie('token', { path: '/' });
        navigate('/');
    };

    const loadNotification = async () => {
        try {
            let response = await getNotification(cookies.token, cookies.userId)
            setNotifications(response);
        } catch (exception) {

        }
    }

    const markAsReadNotification = async (notificationId) => {
        let response = await readNotification(cookies.token, notificationId);
        if (response === 0) {
            loadNotification();
        }
    }

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                flexWrap: "nowrap",
                backgroundColor: "#034ea2",
                height: 70,
                color: "#fff"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                }}>
                    <button style={{
                        backgroundColor: "#034ea2",
                        justifyContent: 'left',
                        width: 100
                    }} onClick={() => {
                        setIsOpen(!isOpen);
                    }}><ListTask size={30} /></button>
                  <h1>Silikon3</h1>
                    {/* <div style={{
                        display:"flex",
                        flexDirection:"row",
                        flexWrap:"nowrap"
                    }}>
                        <div style={{display:"flex", alignItems:"center"}}><img src={weblogo} alt="Icon" style={{ width: '50px', height: '50px' }} /></div>
                        <div style={{paddingRight:10}}></div>
                        <div style={{display:"flex", alignItems:"center", fontSize:25}}>{pageName}</div>
                    </div> */}
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginRight: 100
                }}>
                    <div className="notification-icon" onClick={toggleDropdown}>
                        <Bell />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadNotifcation}</span>
                        )}

                        {isDropdownOpen && (
                            <div className="notifications-dropdown">
                                {notifications.map((notification) => (
                                    <Notification
                                        key={notification.id}
                                        notification={notification}
                                        markAsRead={markAsRead}
                                        data={notification}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{
                        paddingLeft: 10,
                        alignItems: "center"
                    }} className="username">
                        {userName}
                    </div>
                    <div style={{
                        paddingLeft: 10,
                        alignItems: "center",
                        cursor: "pointer"
                    }} onClick={() => {
                        handleLogout()
                    }}>
                        <Power size={25} color='red' />
                    </div>
                </div>
            </div>
            {/* <nav className="navbar">
                <div className="navbar-left">
                    <h1><House/> Dashboard</h1>
                </div>
                <div className="navbar-right">
                    <div className="notification-icon" onClick={toggleDropdown}>
                        <Bell />
                        {isDropdownOpen && (
                            <div className="notifications-dropdown">
                                {notifications.map((notification) => (
                                    <Notification
                                        key={notification.id}
                                        notification={notification}
                                        markAsRead={markAsRead}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="username">
                        {"Dodi Agustin Refansius Pakpahan Orang Pematangsiantar"}
                    </div>
                </div>
            </nav> */}

        </>

    );
};

export default Navbar;
