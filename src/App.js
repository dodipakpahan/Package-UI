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
import PackageStep2Page from "./Pages/Packages/PackageStep/Step2";
import PackageStep3Page from "./Pages/Packages/PackageStep/Step3";
import PackageStep4Page from "./Pages/Packages/PackageStep/Step4";
import PackageStep5Page from "./Pages/Packages/PackageStep/Step5";
import PackageStep6Page from "./Pages/Packages/PackageStep/Step6";
import PackageStep7Page from "./Pages/Packages/PackageStep/Step7";
import PackageStep8Page from "./Pages/Packages/PackageStep/Step8";
import PackageStep9Page from "./Pages/Packages/PackageStep/Step9";
import PackageStep10Page from "./Pages/Packages/PackageStep/Step10";
import PackageStep11Page from "./Pages/Packages/PackageStep/Step11";
import PackageStep12Page from "./Pages/Packages/PackageStep/Step12";
import PackageStep13Page from "./Pages/Packages/PackageStep/Step13";
import PackageStep14Page from "./Pages/Packages/PackageStep/Step14";
import PackageStep15Page from "./Pages/Packages/PackageStep/Step15";
import PackageStep16Page from "./Pages/Packages/PackageStep/Step16";
import PackageStep17Page from "./Pages/Packages/PackageStep/Step17";
import PackageStep18Page from "./Pages/Packages/PackageStep/Step18";
import PackageStep19Page from "./Pages/Packages/PackageStep/Step19";
import PackageStep20Page from "./Pages/Packages/PackageStep/Step20";
import PackageStep21Page from "./Pages/Packages/PackageStep/Step21";
import PackageStep22Page from "./Pages/Packages/PackageStep/Step22";
import PackageStep23Page from "./Pages/Packages/PackageStep/Step23";
import PackageStep24Page from "./Pages/Packages/PackageStep/Step24";
import PackageStep25Page from "./Pages/Packages/PackageStep/Step25";
import PackageStep26Page from "./Pages/Packages/PackageStep/Step26";
import PackageStep27Page from "./Pages/Packages/PackageStep/Step27";
import PackageStep28Page from "./Pages/Packages/PackageStep/Step28";
import PackageStep29Page from "./Pages/Packages/PackageStep/Step29";
import PackageStep30Page from "./Pages/Packages/PackageStep/Step30";
import PackageStep31Page from "./Pages/Packages/PackageStep/Step31";
import PackageStep32Page from "./Pages/Packages/PackageStep/Step32";
import PackageStep33Page from "./Pages/Packages/PackageStep/Step33";
import PackageStep34Page from "./Pages/Packages/PackageStep/Step34";
import UserAccountPage from "./Pages/UserAccount";
import UserAccountDetailPage from "./Pages/UserAccount/Detail";
import ChangePasswordPage from "./Pages/ChangePassword";
import AccountTypePage from "./Pages/AccountType";

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
        <Route path="/PackageStep/Step2" element={<PackageStep2Page/>}/>
        <Route path="/PackageStep/Step3" element={<PackageStep3Page/>}/>
        <Route path="/PackageStep/Step4" element={<PackageStep4Page/>}/>
        <Route path="/PackageStep/Step5" element={<PackageStep5Page/>}/>
        <Route path="/PackageStep/Step6" element={<PackageStep6Page/>}/>
        <Route path="/PackageStep/Step7" element={<PackageStep7Page/>}/>
        <Route path="/PackageStep/Step8" element={<PackageStep8Page/>}/>
        <Route path="/PackageStep/Step9" element={<PackageStep9Page/>}/>
        <Route path="/PackageStep/Step10" element={<PackageStep10Page/>}/>
        <Route path="/PackageStep/Step11" element={<PackageStep11Page/>}/>
        <Route path="/PackageStep/Step12" element={<PackageStep12Page/>}/>
        <Route path="/PackageStep/Step13" element={<PackageStep13Page/>}/>
        <Route path="/PackageStep/Step14" element={<PackageStep14Page/>}/>
        <Route path="/PackageStep/Step15" element={<PackageStep15Page/>}/>
        <Route path="/PackageStep/Step16" element={<PackageStep16Page/>}/>
        <Route path="/PackageStep/Step17" element={<PackageStep17Page/>}/>
        <Route path="/PackageStep/Step18" element={<PackageStep18Page/>}/>
        <Route path="/PackageStep/Step19" element={<PackageStep19Page/>}/>
        <Route path="/PackageStep/Step20" element={<PackageStep20Page/>}/>
        <Route path="/PackageStep/Step21" element={<PackageStep21Page/>}/>
        <Route path="/PackageStep/Step22" element={<PackageStep22Page/>}/>
        <Route path="/PackageStep/Step23" element={<PackageStep23Page/>}/>
        <Route path="/PackageStep/Step24" element={<PackageStep24Page/>}/>
        <Route path="/PackageStep/Step25" element={<PackageStep25Page/>}/>
        <Route path="/PackageStep/Step26" element={<PackageStep26Page/>}/>
        <Route path="/PackageStep/Step27" element={<PackageStep27Page/>}/>
        <Route path="/PackageStep/Step28" element={<PackageStep28Page/>}/>
        <Route path="/PackageStep/Step29" element={<PackageStep29Page/>}/>
        <Route path="/PackageStep/Step30" element={<PackageStep30Page/>}/>
        <Route path="/PackageStep/Step31" element={<PackageStep31Page/>}/>
        <Route path="/PackageStep/Step32" element={<PackageStep32Page/>}/>
        <Route path="/PackageStep/Step33" element={<PackageStep33Page/>}/>
        <Route path="/PackageStep/Step34" element={<PackageStep34Page/>}/>
        <Route path="/UserAccount" element={<UserAccountPage/>}/>
        <Route path="/UserAccount/Detail" element={<UserAccountDetailPage/>}/>
        <Route path="/ChangePassword" element={<ChangePasswordPage/>}/>
        <Route path="/AccountType" element={<AccountTypePage/>}/>

      </Routes>
    </BrowserRouter>
  )
}
