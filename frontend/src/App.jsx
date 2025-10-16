import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"

import User from "./pages/User"
import HospitalForm from "./pages/Hospital/HospitalRegister"
import HospitalList from "./pages/Hospital/HospitalList"
import HospitalDetail from "./pages/Hospital/HospitalDetail"
import Hospital from "./pages/Hospital/Hospital"
import Navbar from "./Components/Navbar"
import HospitalDashboard from "./pages/Hospital/HospitalDashboard"
import HospitalLogin from "./pages/Hospital/HospitalLogin"

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<User />} />
        
        <Route path="/hospital" element={<Hospital />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/register" element={<HospitalForm />} />
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/bulk" element={<HospitalList />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />
        
        <Route path="/camps" element={<HospitalForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
