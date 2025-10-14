import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"

import User from "./pages/User"
import HospitalForm from "./pages/Hospital/HospitalForm"
import HospitalList from "./pages/Hospital/HospitalList"
import HospitalDetail from "./pages/Hospital/HospitalDetail"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<User />} />
        <Route path="/hospital/create-form" element={<HospitalForm />} />
        <Route path="/hospital/bulk" element={<HospitalList />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
