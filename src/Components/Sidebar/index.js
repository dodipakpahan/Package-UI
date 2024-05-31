import React, { useState } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { House, BoxSeam, ListTask, Hourglass, BoxArrowInLeft } from "react-bootstrap-icons";


import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import webLogo from "../../Assets/images/logo-dki-jakarta-1-removebg-preview.png"

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
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              backgroundColor: '#0b2948',
              color: '#8ba1b7',
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
            <MenuItem component={<Link to="/Dashboard" />} icon={<House size={30} />}> Dashboard</MenuItem>
            {/* <SubMenu label="Menu 1">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu> */}
            <MenuItem component={<Link to="/Package" />} icon={<BoxSeam size={30} />}> Paket</MenuItem>
            <MenuItem component={<Link to="/PackageProcess" />} icon={<Hourglass size={30} />}> Proses Paket</MenuItem>

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
