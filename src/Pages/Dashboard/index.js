import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css"
import { useCookies } from "react-cookie";
import { Button, Table } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import { isTokenValid } from "../../Helpers/ApplicationHelper";
import LoadingAnimation from "../../Components/Loading";
import { Container } from "react-bootstrap";
import { Cookie, FilePlusFill, House } from "react-bootstrap-icons";
import Navbar from "../../Components/Navbar";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [cookies, setCookie] = useCookies(["token"]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
             

            }
        }
        checkCookies();
    }, []);

    return (
        <>

            <div style={{ display: "flex", height: "100%" }}>
                <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                 />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    flexWrap: "nowrap"
                }}>
                    <Navbar
                        userName={cookies.userName}
                        pageName={"Dashboard"}
                        pageLogo={<House size={30}/>}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                     />
                    <div style={{paddingBottom:30}}></div>
                    <Container fluid style={{
                        display: "flex",
                        flex: 1,
                        width: "100%",
                        flexDirection: "column",
                        
                        // alignContent: "center",
                        // justifyContent: "center",
                        // alignItems: "center",
                        // alignSelf: "center"
                    }} >

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            // borderStyle: "solid",
                            width: "100%",
                            flexWrap: "nowrap"

                        }}>

                          

                            <LoadingAnimation
                                isLoading={isLoading}
                            />


                        </div>

                    </Container>
                </div>



            </div>

        </>
    )
}