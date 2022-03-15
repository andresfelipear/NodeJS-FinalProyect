import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState, useContext } from "react";
import {
    Heading,
    Button,
    Notification,
} from "react-bulma-components";
import { UserContext } from '../context/UserContext'

function ResetPassword() {
    const [password, setPassword] = useState(undefined);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [notiTitle, setNotiTitle] = useState("")
    const [notiBody, setNotiBody] = useState("")


    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const userId = searchParams.get('id')
    const token = searchParams.get('token') 

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
        const body = { password, userId, token };
        console.log(body)
        setIsLoading(true);
        fetch("http://localhost:8000/api/user/resetPassword", {
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
                    openModal("Password Confirm", "Please login with your new password");
                }
                return res.json()
            })
            .catch((err) => {
                console.log(err)
                setStatus("error");
                setIsLoading(false);
                openModal("Error Recovery", "The reset token expires or the user do not exist. Try again");
            });
    };

    useEffect(() => {
        if (password) {
            setDisabled(false)
        }

        return () => {
            setStatus("")
            setIsLoading(false)
        }
    }, [password])

    return (
        <main className="section mt-6 widthForm ">

            <div className="title is-3">Reset Password</div>
            <div className="has-background-light p-6 borderRadius">
                <div className="field">
                    <label className="label" htmlFor="username">New Password</label>
                    <div className="control">
                        <input className="input mb-3" type="password" name="username" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="is-flex is-justify-content-center mt-4">
                    <button
                        className={`button ${isLoading && 'is-loading'} ${disabled && 'is-danger'} ${!disabled && 'is-link'}`}
                        disabled={disabled}
                        onClick={submit}
                        type="submit">
                        Reset Password
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

export default ResetPassword