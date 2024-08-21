import React, { useState } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { House, BoxSeam, ListTask, Hourglass, BoxArrowInLeft, C } from "react-bootstrap-icons";


import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import webLogo from "../../Assets/images/logo-dki-jakarta-1-removebg-preview.png"
import craneLogo from "../../Assets/images/lift.png"
import craneLogo2 from "../../Assets/images/tower-crane.png"
import home from "../../Assets/images/home.png"
import userLogo from "../../Assets/images/userLogo.png"
import lockPassword from "../../Assets/images/padlock.png"

function SideNavigationBar({
  isOpen,
  setIsOpen
}) {
  // const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  // const toggleSidebar = () => {
  //   setIsOpen(!isOpen);
  // };

  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    navigate('/');
  };


  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', borderRightStyle:"solid",borderWidth:3, borderColor:"#f4f6f9" }}>
        <Sidebar width='230px'
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              // backgroundColor: '#0b2948',
              backgroundColor:"#ffffff",
              color: 'black',
            },
          }}
          collapsed={isOpen}
        >
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <img src={webLogo} width={"100%"}></img>
          </div>
          <div style={{paddingBottom:30}}></div>


          <Menu theme={'dark'} mode={'inline'}
          // menuItemStyles={{
          //   button: ({ level, active, disabled }) => {
          //     // only apply styles on first level elements of the tree
          //     if (level === 0)
          //       return {
          //         menuContent: '#082440',
          //         icon: '#59d0ff',
          //         hover: {
          //           backgroundColor: '#00458b',
          //           color: '#b6c8d9',
          //         },
          //         disabled: {
          //           color: '#3e5e7e',
          //         },
          //       };
          //   },
          // }}
          >
            <MenuItem component={<Link to="/Dashboard" />} icon={<img src={home} alt="Icon" style={{ width: '35px', height: '35px', color:"white" }} />}> <div style={{fontSize:25, alignItems:"center"}}>Beranda</div></MenuItem>
            {/* <SubMenu label="Menu 1">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu> */}
            <MenuItem component={<Link to="/Package" />} icon={<img src={craneLogo} alt="Icon" style={{ width: '35px', height: '35px', color:"white", alignItems:"center" }} />}> <div style={{fontSize:25, alignItems:"center"}}>Paket</div></MenuItem>
            <MenuItem component={<Link to="/ChangePassword" />} icon={<img src={lockPassword} alt="Icon" style={{ width: '35px', height: '35px', color:"white", alignItems:"center" }} />}> <div style={{fontSize:25, alignItems:"center"}}>Kata Sandi</div></MenuItem>

            {
              cookies.userRole === 1 && cookies.accountType === "ce25664b-547b-44b6-b5c4-07cb76450321" &&
              <>
              <MenuItem component={<Link to="/UserAccount" />} icon={<img src={userLogo} alt="Icon" style={{ width: '35px', height: '35px', color:"white", alignItems:"center" }} />}> <div style={{fontSize:25, alignItems:"center"}}>Akun </div></MenuItem>
              <MenuItem component={<Link to="/AccountType" />} icon={<img src={userLogo} alt="Icon" style={{ width: '35px', height: '35px', color:"white", alignItems:"center" }} />}> <div style={{fontSize:25, alignItems:"center"}}>Jenis Akun </div></MenuItem>
              </>
              
            }
              {/* <MenuItem component={<Link to="/PackageProcess" />} icon={<Hourglass size={30} />}> Proses Paket</MenuItem> */}

            {/* <div style={{
              position: "absolute",
              bottom: 40,
              paddingLeft: 15
            }}>

              <MenuItem onClick={() => {
                handleLogout();
              }} icon={<BoxArrowInLeft size={50} />}>  Log out</MenuItem>


            </div> */}

          </Menu>



        </Sidebar >

      </div>
    </>

  );
};

export default SideNavigationBar;
