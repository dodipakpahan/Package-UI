import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css"
import { useCookies } from "react-cookie";
import { Button, Table } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import { isTokenValid, getCountTotalPackage, getCountTotalPackageInProgress, getCountTotalPackageComplete } from "../../Helpers/ApplicationHelper";
import LoadingAnimation from "../../Components/Loading";
import { Container } from "react-bootstrap";
import { Cookie, FilePlusFill, House } from "react-bootstrap-icons";
import Navbar from "../../Components/Navbar";
import packetNew from "../../Assets/images/packet_new-removebg-preview.png";
import packetProgress from "../../Assets/images/packet_process-removebg-preview.png";
import packetDone from "../../Assets/images/packet_done-removebg-preview.png"
import webLogo from "../../Assets/images/log-silikon-removebg-preview.png"

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [cookies, setCookie] = useCookies(["token"]);
    const [isOpen, setIsOpen] = useState(false);
    const [totalPackage, setTotalPackage] = useState("");
    const [totalPackageComplete, setTotalPackageComplete] = useState("");
    const [totalPackageInProgress, setTotalPackageInProgress] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                loadCountPackage();

            }
        }
        checkCookies();
    }, []);

    const loadCountPackage = async () => {
        try {
            let total = await getCountTotalPackage(cookies.token, cookies.userRole, cookies.accountType);
            setTotalPackage(total);

            let totalComplete = await getCountTotalPackageComplete(cookies.token, cookies.userRole, cookies.accountType);
            setTotalPackageComplete(totalComplete);

            let totalInProgress = await getCountTotalPackageInProgress(cookies.token, cookies.userRole, cookies.accountType);
            setTotalPackageInProgress(totalInProgress)
            setIsLoading(false);
        } catch (exception) {

        }
    }

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
                        pageLogo={<House size={30} />}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                    <div style={{ paddingBottom: 30 }}></div>
                    <Container fluid style={{
                        display: "flex",
                        flex: 1,
                        width: "100%",
                        flexDirection: "column",
                        position: "relative"
                        // alignContent: "center",
                        // justifyContent: "center",
                        // alignItems: "center",
                        // alignSelf: "center"
                    }} >
                       
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${webLogo})`,
                            backgroundSize: "30%",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            opacity: 0.1,
                            pointerEvents: "none",
                            zIndex: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.5)" // Debugging background color
                        }}></div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            // borderStyle: "solid",
                            width: "100%",
                            flexWrap: "nowrap"

                        }}>


                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%"
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        minHeight: 300,
                                        minWidth: 300,
                                        // borderStyle: "solid",
                                        flex: 1,
                                        borderRadius: 30,
                                        borderColor: "#f4f6f9"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            flex: 1,
                                            // alignItems: "center",
                                            justifyContent: "center",


                                        }}>
                                            <img src={packetNew} width={"40%"} />
                                        </div>
                                        <div style={{ display: "flex", flex: 1, justifyContent: 'center', textAlign: "center", fontSize: 30 }}>Jumlah Paket</div>
                                        <div style={{ display: "flex", flex: 1, justifyContent: 'center', alignItems: "center", fontSize: 30 }}>{totalPackage}</div>


                                    </div>
                                    <div style={{ paddingRight: 50 }}></div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        minHeight: 300,
                                        minWidth: 300,
                                        // borderStyle: "solid",
                                        flex: 1,
                                        borderRadius: 30,
                                        borderColor: "#f4f6f9"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            flex: 1,
                                            justifyContent: "center",

                                        }}>
                                            <img src={packetProgress} width={"40%"} />
                                        </div>
                                        <div style={{ display: "flex", flex: 1, justifyContent: 'center', textAlign: "center", fontSize: 30 }}>Jumlah Paket Dalam Proses</div>
                                        <div style={{ display: "flex", flex: 1, justifyContent: 'center', alignItems: "center", fontSize: 30 }}>{totalPackageInProgress}</div>
                                    </div>
                                    <div style={{ paddingRight: 50 }}></div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        minHeight: 300,
                                        minWidth: 300,
                                        // borderStyle: "solid",
                                        flex: 1,
                                        borderRadius: 30,
                                        borderColor: "#f4f6f9"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            flex: 1,

                                        }}>
                                            <img src={packetDone} width={"40%"} />
                                        </div>
                                        <div style={{ display: "flex", flex: 1, justifyContent: 'center', textAlign: "center", fontSize: 30 }}>Jumlah Paket Selesai</div>
                                        <div style={{ display: "flex", flex: 1, justifyContent: 'center', alignItems: "center", fontSize: 30 }}>{totalPackageComplete}</div>
                                    </div>
                                </div>


                            </div>

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