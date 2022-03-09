
import "./Header.css"
import React, { useCallback, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";


function Header() {
    const [userContext, setUserContext] = useContext(UserContext);

    const fetchUserDetails = useCallback(() => {
        fetch("http://localhost:8000/api/user/me", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                setUserContext((prev) => ({ ...prev, details: data }));
            } else {
                if (response.status === 401) {
                    window.location.reload();
                } else {
                    setUserContext((prev) => ({ ...prev, details: null }));
                }
            }
        });
    }, [setUserContext, userContext.token]);

    useEffect(() => {
        if (!userContext.details && userContext.token) {
            fetchUserDetails();
        }
    }, [fetchUserDetails, userContext.details]);

    const logoutHandler = () => {
        fetch("http://localhost:8000/api/user/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            else {
                const data = await response.json()
                setUserContext(prev => ({ ...prev, details: undefined, token: null }))
            }

        });
    }


    return (
        <div>
            <nav className="navbar is-info">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        <span className='spanIcon'>
                            <i className="fas fa-blog"></i>
                        </span>

                    </a>
                    <div className="navbar-burger" data-target="navbarExampleTransparentExample">
                    </div>
                </div>

                <div id="navbarExampleTransparentExample" className="navbar-menu">

                    <div className="navbar-start">
                        <a className="navbar-item" href="/"> Posts </a>
                        {userContext.details && (<a className="navbar-item" href="/admin/add-post"> Add Post </a>)}
                    </div>

                    <div className="navbar-end">

                        {userContext.details ? (
                            <>
                                <div className="navbar-item">
                                    <div className="icon-text">
                                        <span className="icon has-text-warning">
                                            <i className={`fas ${userContext.details.icon}`}></i>
                                        </span>
                                        <span>{userContext.details.username}</span>
                                    </div>
                                </div>
                                <div className="navbar-item">
                                    <button className="button is-light" type="submit" onClick={logoutHandler}> Log Out </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <a className="navbar-item" href="/login"> Login </a>
                                <a className="navbar-item" href="/signup">Sign Up</a>
                            </>

                        )}



                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header