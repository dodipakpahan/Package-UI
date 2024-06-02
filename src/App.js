import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login";
import DashboardPage from "./Pages/Dashboard";
import PackagePage from "./Pages/Packages";
import DetailPAckagePage from "./Pages/Packages/Detail";
import PackageProcessPage from "./Pages/PackageProcess";
import DetailPAckageProcessPage from "./Pages/PackageProcess/Detail";
import PackageStep from "./Pages/Packages/PackageStep";
import PackageStepDetailPage from "./Pages/Packages/PackageStep/Detail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/Dashboard" element={<DashboardPage/>}/>
        <Route path="/Package" element={<PackagePage/>}/>
        <Route path="/Package/Detail" element={<DetailPAckagePage/>}/>
        <Route path="/PackageProcess" element={<PackageProcessPage/>}/>
        <Route path="/PackageProcess/Detail" element={<DetailPAckageProcessPage/>}/>
        <Route path="/Package/Step" element={<PackageStep/>}/>
        <Route path="/PackageStep/Detail" element={<PackageStepDetailPage/>}/>

      </Routes>
    </BrowserRouter>
  )
}
