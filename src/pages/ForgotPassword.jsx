import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import {
    Heading,
    Notification,
} from "react-bulma-components";

function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [notiTitle, setNotiTitle] = useState("")
    const [notiBody, setNotiBody] = useState("")

    const navigate = useNavigate()
    const location = useLocation()

    const openModal = (title, message) => {
        const modalContainer = document.getElementById("modal-container");
        modalContainer.classList.add("is-active");
        setNotiTitle(title);
        setNotiBody(message);
    }

    const closeModal = () => {
        const modalContainer = document.getElementById("modal-container");
        modalContainer.classList.remove("is-active");
        if (status === "success") {
            setStatus("")
            let from = location.state?.from?.pathname || '/login'
            navigate(from, { replace: true })
        }


    }


    const submit = () => {
        const body = { username };
        setIsLoading(true);
        fetch("http://localhost:8000/api/user/forgot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include"
        })
            .then(async (res) => {
                if (!res.ok) {
                    setIsLoading(false);
                    throw new Error(res.status);
                } else {
                    setStatus("success");
                    setIsLoading(false);
                    openModal("Recovery email send", "Please check your email");
                }
                return res.json()
            })
            .catch((err) => {
                console.log(err)
                setStatus("error");
                setIsLoading(false);
                openModal("Error Recovery", "Username that you entered not exist. Try Again");
            });
    };

    useEffect(() => {
        if (username) {
            setDisabled(false)
        }

        return () => {
            setStatus("")
            setIsLoading(false)
        }
    }, [username])

    return (
        <main className="section mt-6 widthForm ">

            <div className="title is-3">Forgot Password</div>
            <div className="has-background-light p-6 borderRadius">
                <div className="field">
                    <label className="label" htmlFor="username">Username</label>
                    <div className="control">
                        <input className="input mb-3" type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                </div>
                <div className="is-flex is-justify-content-center mt-4">
                    <button
                        className={`button ${isLoading && 'is-loading'} ${disabled && 'is-danger'} ${!disabled && 'is-link'}`}
                        disabled={disabled}
                        onClick={submit}
                        type="submit">
                        Forgot Password
                    </button>

                </div>


                {isLoading && <span>Loading...</span>}
            </div>

            <div className="modal" id="modal-container">
                <div className="modal-background"></div>
                <div className="modal-content">

                    <Notification p={5} m={6} color="warning">
                        <Heading mb={2} >{notiTitle}</Heading>
                        {notiBody}.
                    </Notification>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
            </div>
        </main>
    )
}

export default ForgotPassword