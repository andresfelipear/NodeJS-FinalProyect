import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from "react";
import {
  Heading,
  Notification,
} from "react-bulma-components";
import { UserContext } from '../context/UserContext'

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [notiTitle, setNotiTitle] = useState("")
  const [notiBody, setNotiBody] = useState("")

  const [userContext, setUserContext] = useContext(UserContext)

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
    setPassword("");
    setUsername("");

  }

  const submit = () => {
    const body = { username, password };
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
          setIsLoading(false);
          setUserContext(prev => ({ ...prev, token: data.token }))
          let from = location.state?.from?.pathname || '/'
          navigate(from, { replace: true })
          return data
        }
      })
      .catch((err) => {
        setIsLoading(false);
        openModal("Error Login", "Username or password that you entered is incorrect. Use a valid credential and try again.");
      });
  };

  useEffect(() => {
    if (password && username) {
      setDisabled(false)
    }

    return () => {
      setIsLoading(false)
    }
  }, [password, username])


  return (
    <main className="section mt-6 widthForm">
      <div className="p-6 borderRadius has-background-light">
        <div className="field">
          <label className="label" htmlFor="username">Username</label>
          <div className="control">
            <input className="input" type="text" name="username" onChange={(e) => setUsername(e.target.value)} value={username} />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <div className="control">
            <input className="input" type="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
          <Link className='has-text-info is-italic has-text-weight-light' to={"/forgotPassword"}> Forgot Password?</Link>
        </div>
        <div className="is-flex is-justify-content-center mt-4">
          <button
            className={`button ${isLoading && 'is-loading'} ${disabled && 'is-danger'} ${!disabled && 'is-link'}`}
            disabled={disabled}
            onClick={submit}
            type="submit">
            Login
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

export default LoginPage