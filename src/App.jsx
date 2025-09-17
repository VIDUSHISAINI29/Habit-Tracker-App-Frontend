import { useState, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import {AuthContext} from './context/AuthContext'
// import './App.css'
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  // console.log("user  = = ",user);
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
   
  return (
    <>
    <Navbar/>
      <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
         
          </Routes>
    </>
  )
}

export default App
