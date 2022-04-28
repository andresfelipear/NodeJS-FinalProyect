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
import Modal from "../components/notification/Modal";


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
    const [notiTitle, setNotiTitle] = useState("")
    const [notiBody, setNotiBody] = useState("")
    const [passwordHelper, setPasswordHelper] = useState("")
    const [confirmPasswordHelper, setConfirmPasswordHelper] = useState("")

    const navigate = useNavigate()
    const location = useLocation()

    const [userContext, setUserContext] = useContext(UserContext)

    const openModal = (title, message) => {
        const modalContainer = document.getElementById("modal-container");
        modalContainer.classList.add("is-active");
        setNotiTitle(title);
        setNotiBody(message);
    }

    const closeModal = () => {
        const modalContainer = document.getElementById("modal-container");
        modalContainer.classList.remove("is-active");
    }

    const onChange = (event) => {
        if (event.target.name === "password") setPassword(event.target.value);
        if (event.target.name === "confirmPassword")
            setConfirmPassword(event.target.value);
    };

    const submit = () => {
        const body = { username, email, password, icon };
        setIsLoading(true);
        fetch(process.env.REACT_APP_API_ENDPOINT+"/api/user/signup", {
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
                setIsLoading(false);
                setUserContext(prev => ({ ...prev, token: data.token }))
                let from = location.state?.from?.pathname || '/'
                navigate(from, { replace: true })
            })
            .catch((err) => {
                openModal("Error Signing Up!", "Username and/or Email already exists")
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if(password){
            if(password.length <=3){
                setPasswordHelper('Password must have more than 3 characters')
            }
            else{
                setPasswordHelper("")
            }
        }
        if(confirmPassword){
            if(confirmPassword.length <=3){
                setConfirmPasswordHelper('Confirm Password must have more than 3 characters')
            }else{
                setConfirmPasswordHelper("")
            }
        }
        if (password && confirmPassword) {
            if((password.length>3) && (confirmPassword.length>3)){
                if(password === confirmPassword){
                    setDisabled(false)
                }else{
                    setDisabled(true)
                    openModal("Incorrect Credentials", "Password and confirm password do not match")
                }
                
            }
        } else {
            setDisabled(true)
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


            <div className="widthForm has-background-light borderRadius">
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
                    <p class="help is-danger">{passwordHelper}</p>
                </div>
                <div className="field">
                    <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="control">
                        <input className="input" type="password" name="confirmPassword" onChange={onChange} />
                    </div>
                    <p class="help is-danger">{confirmPasswordHelper}</p>
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


            <Modal notiTitle={notiTitle} notiBody={notiBody} handleClose={closeModal} />
        </main>
    )
}
