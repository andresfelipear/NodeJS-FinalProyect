import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from "react";
import {
  Heading,
  Button,
  Notification,
} from "react-bulma-components";
import { UserContext } from '../context/UserContext'

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(undefined);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [userContext, setUserContext] = useContext(UserContext)

  const navigate = useNavigate()
  const location = useLocation()

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
          setStatus("success");
          setIsLoading(false);
          setUserContext(prev => ({ ...prev, token: data.token }))
          let from = location.state?.from?.pathname || '/'
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
    if (password && username) {
      setDisabled(false)
    }

    return () => {
      setStatus("")
      setIsLoading(false)
    }
  }, [password, username])


  return (
    <main className="section mt-6 widthForm">
      {status === "error" && (
            <Notification>
              <Heading>Error Login!</Heading>
              Username or password that you entered is incorrect. Use a valid credential and try again.
              <Button remove role="alertdialog" onClick={() => setStatus("")} />
            </Notification>
          )}
          {/* {status === "success" && (
          <Notification>
            <Heading>Signed Up Successfully</Heading>
            Click <a href='/'>here</a> to go to main Page
            <Button remove role="alertdialog" onClick={() => setStatus("")} />
          </Notification>
        )} */}
      <div className="p-6 borderRadius has-background-light">
        <div className="field">
          <label className="label" htmlFor="username">Username</label>
          <div className="control">
            <input className="input" type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <div className="control">
            <input className="input" type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
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


          

    </main>
  )
}

export default LoginPage