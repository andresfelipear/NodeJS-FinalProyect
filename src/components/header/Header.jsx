import React, { useState } from 'react'

function Header() {
    const { loggedIn } = false
    const user = {
        username: "pablito"
    }


    return (
        <div>
            <nav class="navbar is-info">
                <div class="navbar-brand">
                    <a class="navbar-item" href="/">
                        <span style="font-size: 24px; color: goldenrod; ">
                            <i class="fas fa-blog"></i>
                        </span>

                    </a>
                    <div class="navbar-burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div id="navbarExampleTransparentExample" class="navbar-menu">

                    <div class="navbar-start">
                        <a class="navbar-item" href="/admin/"> Posts </a>
                        {loggedIn && (<a class="navbar-item" href="/admin/add-post"> Add Post </a>)}
                    </div>

                    <div class="navbar-end">

                        {loggedIn ? (
                            <>
                                <div class="navbar-item">
                                    {user.username}
                                </div>
                                <form action="/logout" method="post">

                                    <div class="navbar-item">
                                        <button class="button is-light" type="submit"> Log Out </button>
                                    </div>

                                </form>
                            </>
                        ) : (
                            <>
                                <a class="navbar-item" href="/login"> Login </a>
                                <a class="navbar-item" href="/signup">Sign Up</a>
                            </>

                        )}



                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header