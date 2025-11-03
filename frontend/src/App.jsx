import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserForm from "./pages/User/Userform"
import HospitalForm from "./pages/Hospital/HospitalRegister"
import HospitalList from "./pages/Hospital/HospitalList"
import HospitalDetail from "./pages/Hospital/HospitalDetail"
import Hospital from "./pages/Hospital/Hospital"
import Navbar from "./Components/Navbar"
import HospitalDashboard from "./pages/Hospital/HospitalDashboard"
import HospitalLogin from "./pages/Hospital/HospitalLogin"
import CampCreate from "./pages/Camp/CampCreate"
import DonationCreate from "./pages/Donate/DonationCreate"
import User from "./pages/User/User"
import Home from "./pages/Home"
import Camps from "./pages/Camp/Camps"
import HospitalRegister from "./pages/Hospital/HospitalRegister"
import HospitalUpdate from "./pages/Hospital/HospitalUpdate"

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="/user/create" element={<UserForm />} />
        <Route path="/user" element={<User />} />
        
        <Route path="/hospital" element={<Hospital />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />
        <Route path="/hospital/update" element={<HospitalUpdate />} />
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/bulk" element={<HospitalList />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />
        
        <Route path="/camps" element={<Camps />} />
        <Route path="/camps/create" element={<CampCreate />} />
        
        <Route path="/donate" element={<DonationCreate />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
