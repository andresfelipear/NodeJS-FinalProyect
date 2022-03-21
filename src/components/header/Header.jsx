
import "./Header.css"
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";


function Header() {
    const [userContext, setUserContext] = useContext(UserContext);
    const mediaDesktop = '(min-width:1024px )';

    const [isDesktop, setIsDesktop] = useState(false)

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

    useEffect(() => {
        const media = window.matchMedia(mediaDesktop)
        if (media.matches !== isDesktop) {
            setIsDesktop(media.matches)
        }
        const listener = () => setIsDesktop(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);

    }, [isDesktop])

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
                <div className="navbar-brand is-flex is-justify-content-space-between">
                    <div className="is-flex">
                        <a className="navbar-item" href="/">
                            <span className='spanIcon'>
                                <i className="fas fa-blog"></i>
                            </span>
                        </a>
                        <a className="navbar-item has-text-white" href="/"> Posts </a>
                    </div>

                    {!isDesktop ? (
                        <div className="is-flex pr-4">

                            {userContext.details ? (
                                <>
                                    <div className="navbar-item">
                                        <div className="icon-text">
                                            <span className="icon has-text-warning">
                                                <i className={`fas ${userContext.details.icon}`}></i>
                                            </span>
                                            <span className="has-text-white">{userContext.details.username}</span>
                                        </div>
                                    </div>
                                    <div className="navbar-item">
                                        <button className="button is-light px-2" type="submit" onClick={logoutHandler}> Log Out </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <a className="navbar-item has-text-white" href="/login"> Login </a>
                                    <a className="navbar-item has-text-white" href="/signup">Sign Up</a>
                                </>

                            )}



                        </div>
                    ) : (
                        <></>
                    )}

                </div>

                <div className="navbar-menu is-active has-text-centered">
                    {isDesktop ? (
                        <>
                            <div className="navbar-start">
                                {userContext.details && (
                                    <>
                                        <a className="navbar-item" href="/admin/myPosts"> MyPosts </a>
                                        <hr className="navbar-divider"/>
                                        <a className="navbar-item" href="/admin/add-post"> Add Post </a>
                                    </>

                                )}
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
                                        <a className="navbar-item has-text-white" href="/login"> Login </a>
                                        <a className="navbar-item has-text-white" href="/signup">Sign Up</a>
                                    </>

                                )}



                            </div>
                        </>
                    ) :
                        (
                            <div className="navbar-start">
                                {userContext.details && (
                                    <>
                                        <a className="navbar-item" href="/admin/myPosts"> MyPosts </a>
                                        <hr className="navbar-divider"/>
                                        <a className="navbar-item" href="/admin/add-post"> Add Post </a>
                                    </>

                                )}
                            </div>

                        )}

                </div>
            </nav>
        </div>
    )
}

export default Header