import React, { useState } from 'react'
import "./Header.css"

function Header() {
    const { loggedIn } = false
    const user = {
        username: "pablito"
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
                        {loggedIn && (<a className="navbar-item" href="/admin/add-post"> Add Post </a>)}
                    </div>

                    <div className="navbar-end">

                        {loggedIn ? (
                            <>
                                <div className="navbar-item">
                                    {user.username}
                                </div>
                                <form action="/logout" method="post">

                                    <div className="navbar-item">
                                        <button className="button is-light" type="submit"> Log Out </button>
                                    </div>

                                </form>
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