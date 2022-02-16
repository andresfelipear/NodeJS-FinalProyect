import { useEffect, useState, useContext } from "react";
import React from 'react'
import {
    Heading,
    Button,
    Notification,
} from "react-bulma-components";
import { UserContext } from "../context/UserContext"

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(undefined);
    const [confirmPassword, setConfirmPassword] = useState(undefined);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const [userContext, setUserContext] = useContext(UserContext)

    const onChange = (event) => {
        if (event.target.name === "password") setPassword(event.target.value);
        if (event.target.name === "confirmPassword")
            setConfirmPassword(event.target.value);
    };

    const submit = () => {
        const body = { username, email, password };
        setIsLoading(true);
        fetch("http://localhost:8000/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) {
                    setIsLoading(false);
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setStatus("success");
                setIsLoading(false);
                setUserContext(prev => ({ ...prev, token: data.token }))
            })
            .catch((err) => {
                setStatus("error");
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (password && confirmPassword) {
            setDisabled(password !== confirmPassword)
        }

        return () => {
            setStatus("")
            setIsLoading(false)
        }
    }, [password, confirmPassword])

    return (
        <main className="section mt-6 ">

            <div className="widthForm has-background-light">
                {status === "error" && (
                    <Notification>
                        <Heading>Error Signing Up!</Heading>
                        Username and/or Email already exists
                        <Button remove role="alertdialog" onClick={() => setStatus("")} />
                    </Notification>
                )}
                {status === "success" && (
                    <Notification>
                        <Heading>Signed Up Successfully</Heading>
                        Click <a href="/login">here</a> to go to Login page
                        <Button remove role="alertdialog" onClick={() => setStatus("")} />
                    </Notification>
                )}

                <div className="field">
                    <label className="label" htmlFor="username">Username</label>
                    <div className="control">
                        <input className="input" type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                </div>
                <div className="field">
                    <label className="label" htmlFor="email">Email</label>
                    <div className="control">
                        <input className="input" type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="field">
                    <label className="label" htmlFor="password">Password</label>
                    <div className="control">
                        <input className="input" type="password" name="password" onChange={onChange} />
                    </div>
                </div>
                <div className="field">
                    <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="control">
                        <input className="input" type="password" name="confirmPassword" onChange={onChange} />
                    </div>
                </div>

                <div className="is-flex is-justify-content-center mt-4">
                    <button
                        className={`button ${isLoading && 'is-loading'} ${disabled && 'is-danger'} ${!disabled && 'is-link'}`}
                        disabled={disabled}
                        onClick={submit}
                        type="submit">
                        Sign Up
                    </button>

                </div>


                {isLoading && <span>Loading...</span>}
            </div>



        </main>
    )
}
