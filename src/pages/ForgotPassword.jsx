import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from "react";
import {
    Heading,
    Button,
    Notification,
} from "react-bulma-components";
import { UserContext } from '../context/UserContext'

function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(undefined);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const [userContext, setUserContext] = useContext(UserContext)

    const navigate = useNavigate()
    const location = useLocation()

    const submit = () => {
        const body = { username };
        setIsLoading(true);
        fetch("http://localhost:8000/api/user/login", {
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
                    const data = await res.json()
                    setStatus("success");
                    setIsLoading(false);
                    let from = location.state?.from?.pathname || '/login'
                    navigate(from, { replace: true })

                }
                return res.json();
            })
            .catch((err) => {
                setStatus("error");
                setIsLoading(false);
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
    }, [password, username])


    return (
        <main className="section mt-6 widthForm ">

            <div className="title is-3">Forgot Password</div>

            {status === "error" && (
                <Notification color='warning'>
                    <Heading >Error Recovery</Heading>
                    Username that you entered not exist. Try Again.
                    <Button remove role="alertdialog" onClick={() => setStatus("")} />
                </Notification>
            )}
            {/* {status === "success" && (
          <Notification>
            <Heading>Username found</Heading>
            Please check your email
            <Button remove role="alertdialog" onClick={() => setStatus("")} />
          </Notification>
            )} */}

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



        </main>
    )
}

export default ForgotPassword