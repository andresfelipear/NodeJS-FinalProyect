import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/header/Header';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Footer from './components/footer/Footer';

function App() {
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
