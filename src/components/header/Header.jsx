
import "./Header.css"
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";


function Header() {
    const [userContext, setUserContext] = useContext(UserContext);

    const { loggedIn } = false
    const user = {
        username: "pablito"
    }
    console.log(userContext);

    const logoutHandler = () =>{
        fetch("http://localhost:8000/api/user/logout", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(async (response) => {
            setUserContext(prev => ({ ...prev, user: undefined, token: null }))
            
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
                        {userContext.user && (<a className="navbar-item" href="/admin/add-post"> Add Post </a>)}
                    </div>

                    <div className="navbar-end">

                        {userContext.user ? (
                            <>
                                <div className="navbar-item">
                                    {userContext?.user.username}
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