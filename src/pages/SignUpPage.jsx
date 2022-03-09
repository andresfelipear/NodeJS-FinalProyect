import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import {
    Heading,
    Button,
    Notification,
    Icon
} from "react-bulma-components";
import { UserContext } from "../context/UserContext"


export default function SignUpPage() {
    //values fontawesome icons avatar
    const iconTie = "fa-user-tie";
    const iconNinja = "fa-user-ninja";
    const iconPlus = "fa-user-plus";
    const iconAstronaut = "fa-user-astronaut";

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(undefined);
    const [confirmPassword, setConfirmPassword] = useState(undefined);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [icon, setIcon] = useState(iconTie);
    const [selectAvatar, setSelectAvatar] = useState("")

    const navigate = useNavigate()
    const location = useLocation()

    const [userContext, setUserContext] = useContext(UserContext)

    const onChange = (event) => {
        if (event.target.name === "password") setPassword(event.target.value);
        if (event.target.name === "confirmPassword")
            setConfirmPassword(event.target.value);
    };

    const submit = () => {
        const body = { username, email, password, icon };
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
                let from = location.state?.from?.pathname || '/'
                navigate(from, { replace: true })
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

    useEffect(() => {
        if (selectAvatar) {
            if (selectAvatar === "avatar 1") {
                setIcon(iconTie)
            } else if (selectAvatar === "avatar 2") {
                setIcon(iconNinja)
            }
            else if (selectAvatar === "avatar 3") {
                setIcon(iconPlus)
            }
            else if (selectAvatar === "avatar 4") {
                setIcon(iconAstronaut)
            }
        }
        return () => {
            setStatus("")
            setIsLoading(false)
        }
    }, [selectAvatar])

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
                <label className="label" htmlFor="username">Username</label>
                <div className="field has-addons">

                    <div className="control has-icons-left">
                        <div className="select">
                            <select onChange={(e) => setSelectAvatar(e.target.value)}>
                                <option value="avatar 1">#1</option>
                                <option value="avatar 2">#2</option>
                                <option value="avatar 3">#3</option>
                                <option value="avatar 4">#4</option>
                            </select>
                        </div>

                        <div className="icon is-large is-left has-text-info">
                            <i className={`fas fa-lg ${icon && icon}`}></i>
                        </div>

                    </div>

                    <input className="input" type="text" name="username" onChange={(e) => setUsername(e.target.value)} />

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
