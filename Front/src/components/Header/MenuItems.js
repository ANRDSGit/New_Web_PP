import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuItems = (props) => {
    const { parentMenu } = props;
    const location = useLocation();
    const postURL = location.pathname.split('/');
    const pathLength = Number(postURL.length);

    const [home, setHome] = useState(false);
    const [page, setPage] = useState(false);
    const [event, setEvent] = useState(false);
    const [course, setCourse] = useState(false);
    const [blog, setBlog] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    useEffect(() => {
        // Check if JWT token exists in localStorage to determine login status
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const openMobileMenu = (menu) => {
        if (menu === 'home') {
            setHome(!home);
            setPage(false);
            setEvent(false);
            setCourse(false);
            setBlog(false);
        } else if (menu === 'page') {
            setHome(false);
            setPage(!page);
            setEvent(false);
            setCourse(false);
            setBlog(false);
        } else if (menu === 'event') {
            setHome(false);
            setPage(false);
            setEvent(!event);
            setCourse(false);
            setBlog(false);
        } else if (menu === 'course') {
            setHome(false);
            setPage(false);
            setEvent(false);
            setCourse(!course);
            setBlog(false);
        } else if (menu === 'blog') {
            setHome(false);
            setPage(false);
            setEvent(false);
            setCourse(false);
            setBlog(!blog);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token to logout
    };

    return (
        <>
            <li className={location.pathname === "/" ? "menu-active" : ""}>
                <Link to="/">Home</Link>
            </li>
            <li className={location.pathname === "/profile" || location.pathname === "/appointments" || location.pathname === "/course" || location.pathname === "/events" ? "menu-active" : ""}>
                <Link to="#" className={page ? "hash menu-active" : "hash"} onClick={() => { openMobileMenu('page'); }}>
                    Services
                    <span className="arrow "></span>
                </Link>
                <ul className={page ? "sub-menu sub-menu-open" : "sub-menu"}>
                    <li className={location.pathname === "/appointments" ? "menu-active" : ""}>
                        <Link to="/appointments">Appointments</Link>
                    </li>
                    <li>
                        <Link to="https://video-convo-one.vercel.app/mymeetings">Conference</Link>
                    </li>
                    {/* <li className={location.pathname === "/course" ? "menu-active" : ""}>
                        <Link to="/course">Course</Link>
                    </li> */}
                    <li className={parentMenu === 'event' ? 'has-sub menu-active' : 'has-sub'}>
                        <Link to="#" className={event ? "hash menu-active" : "hash"} onClick={() => { openMobileMenu('event'); }}>Events</Link>
                        <ul className={event ? "sub-menu sub-menu-open" : "sub-menu"}>
                            <li className={location.pathname === "/event" ? "menu-active" : ""}>
                                <Link to="/event">Events</Link>
                            </li>
                            <li className={location.pathname === "/event-sidebar" ? "menu-active" : ""}>
                                <Link to="/event-sidebar">Events Sidebar</Link>
                            </li>
                            <li className={postURL[1] === "event" && pathLength > 2 ? "menu-active" : ""}>
                                <Link to="/event/1">Event Single</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>

            <li className={location.pathname === '/about' ? 'menu-active' : ''}>
                <Link to="/about">About</Link>
                {/* <ul className={blog ? "sub-menu sub-menu-open" : "sub-menu"}>
                    <li className={location.pathname === "/blog" ? "menu-active" : ""}>
                        <Link to="/blog">Blog</Link>
                    </li>
                    { <Link to="#" className={blog ? "hash menu-active" : "hash"} onClick={() => { openMobileMenu('blog'); }}>
                        <span className="arrow "></span>
                    </Link> }
                </ul> */}
            </li>

            <li className={location.pathname === '/contact' ? 'menu-active' : ''}>
                <Link to="/contact">Contact</Link>
            </li>

            {/* Conditionally render Profile or Login based on login status */}
            {isLoggedIn ? (
                <li className={location.pathname === "/profile" ? "menu-active" : ""}>
                    <Link to="/profile">Profile</Link>
                </li>
            ) : (
                <li className={location.pathname === "/login" ? "menu-active" : ""}>
                    <Link to="/login">Login</Link>
                </li>
            )}

            <li>
                <Link to="/login" onClick={handleLogout}>Logout</Link>
            </li>


        </>
    );
}

export default MenuItems;
