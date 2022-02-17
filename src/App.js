import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/header/Header';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Footer from './components/footer/Footer';
import { useState, useContext, useEffect, useCallback } from 'react'

import { UserContext } from './context/UserContext'

function App() {
  const [userContext, setUserContext] = useContext(UserContext)
  
  const verifyUser = useCallback(() => {
    fetch("http://localhost:8000/api/user/refreshToken", {
      method: 'POST',
      credentials: "include",
      header: { "Content-Type":"application/json"}
    }).then( async response => {
      if(response.ok){
        const data = await response.json()
        console.log(response)
        setUserContext(prev => ({ ...prev, token: data.token }))
      }else{
        setUserContext(prev => ({ ...prev, token: null }))
      }

      setTimeout(verifyUser, 5 * 30 * 1000) //call refreshtoken every 5 minutes to renew token
    })
  }, [setUserContext])

  useEffect(() => verifyUser(), [verifyUser])

  const syncLogout = useCallback(event => {
    if(event.key === 'logout'){
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("storage", syncLogout)

    return () => {
      window.removeEventListener("storage", syncLogout)
    }
  }, [syncLogout])

  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
