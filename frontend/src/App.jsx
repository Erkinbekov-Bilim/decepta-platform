import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import MainPage from './pages/mainPage/MainPage'
import NotFound from './pages/NotFound'
import AuthProvider from './components/AuthProvider'
import Layout from './pages/layout/Layout'



const Logout = () => {
  localStorage.clear()
  return <Navigate to="/login" />
}

const RegisterAndLogout = () => {
  localStorage.clear()
  return <Register />
}

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route  path="/" element={
            <AuthProvider>
              <MainPage /> 
            </AuthProvider>
          }
          />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/register" element={<RegisterAndLogout />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
