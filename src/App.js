import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Header from './components/header/Header';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/LoginPage';
import Footer from './components/footer/Footer';
import ForgotPassword from './pages/ForgotPassword';
import { useState, useContext, useEffect, useCallback } from 'react'

import { UserContext } from './context/UserContext'
import AddPost from './pages/private/AddPost';
import PostDetailsPage from './pages/PostDetailsPage';
import ResetPassword from './pages/ResetPassword';
import MyPosts from './pages/private/myPosts/MyPosts'

function App() {
  const [userContext, setUserContext] = useContext(UserContext)

  const verifyUser = useCallback(() => {
    fetch("http://localhost:8000/api/user/refreshToken", {
      method: 'POST',
      credentials: "include",
      header: { "Content-Type": "application/json" }
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(prev => ({ ...prev, token: data.token }))
      } else {
        setUserContext(prev => ({ ...prev, token: null }))
      }

      setTimeout(verifyUser, 5 * 30 * 1000) //call refreshtoken every 5 minutes to renew token
    })
  }, [setUserContext])

  useEffect(() => verifyUser(), [verifyUser])

  const syncLogout = useCallback(event => {
    if (event.key === 'logout') {
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
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path='/admin/add-post/:postId' element={<AddPost />} />
          <Route path='/admin/add-post' element={<AddPost />} />
          <Route path='/postDetails/:postId' element={<PostDetailsPage />} />
          <Route path='/passwordReset' element={<ResetPassword />} />
          <Route path='/myPosts' element={<MyPosts />} />
        </Routes>

      <Footer />
    </div>
  );
}

export default App;
