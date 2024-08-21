import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Table, Modal } from "react-bootstrap";
import {
    Search, BoxSeam, PencilFill, Trash, Download, FileWord, FileEarmarkText, ChevronDoubleLeft, ChevronDoubleRight,
    FilePlusFill, ArrowClockwise, GearWideConnected, EyeFill, Eye, InfoCircleFill, ZoomIn, ZoomOut, AspectRatioFill,
    XSquareFill,
    CheckLg
} from "react-bootstrap-icons";
import "../../App.css"
import { Container } from "react-bootstrap";
import {
    isTokenValid, insertUpdateUserAccount, getUserAccountById, updatePassword
} from "../../Helpers/ApplicationHelper";
import Sidebar from "../../Components/Sidebar";
import LoadingAnimation from "../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from "../../Components/Navbar";
import Select from "react-select";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import backLogo from "../../Assets/images/leftArrow.png"
import webLogo from "../../Assets/images/log-silikon-removebg-preview.png"


import ContainerBox from "../../Components/ContainerBox";

export default function ChangePasswordPage() {
    // const [cookies, setCookie] = useCookies(["token"]);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const [buttonReset, setButtonReset] = useState("");
    const location = useLocation();
    const [disabledButton, setDisabledButton] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userChangePasswordId, setUserChangePasswordId] = useState("");
    const [modalChangePassword, setModalChangePassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPasswordLength, setErroPasswordLength] = useState("");
    const [userAccount, setUserAccount] = useState({
        id: 0,
        username: "",
        password: "",
        name: "",
        confirmation_password: "",
        email: ""
    })


    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                
            }
        }
        checkCookies();
    }, [location.state]);


  

    useEffect(() => {
        if (userAccount.password.length <= 6 && userAccount.password !== "") {

            setErroPasswordLength("Kata Sandi Harus Lebih Dari 6 Karakter");
            setErrorMessage("");
            setDisabledButton(true);
        } else {
            if (userAccount.confirmation_password !== "") {
                if (userAccount.password !== userAccount.confirmation_password) {
                    setErrorMessage("Tidak Sesuai Dengan Kata Sandi");
                    setDisabledButton(true);
                } else {
                    setErrorMessage("");
                    setDisabledButton(false);
                }
            }

            setErroPasswordLength("");

        }
    }, [userAccount.password, userAccount.confirmation_password]);

    useEffect(() => {
        if (newPassword.length <= 6 && newPassword !== "") {

            setErroPasswordLength("Kata Sandi Harus Lebih Dari 6 Karakter");
            setErrorMessage("");
            setButtonReset(true);
        } else {
            if (newPassword !== "") {
                if (newPassword !== newPasswordConfirmation) {
                    setErrorMessage("Tidak Sesuai Dengan Kata Sandi");
                    setButtonReset(true);
                } else {
                    setErrorMessage("");
                    setButtonReset(false);
                }
            }

            setErroPasswordLength("");

        }
    }, [newPassword, newPasswordConfirmation])


    
    const resetPassword = async () => {
        try {
            let response = await updatePassword(cookies.token, cookies.userId, newPassword);
            if (response === 0) {
                alert('Berhasil Mengganti Password');
                removeCookie('token', { path: '/' });
                navigate('/');
            } else {
                alert('Gagal Mengganti Password');
            }
        } catch (exception) {

        }
    }





    return (
        <>

            <div style={{ display: "flex", height: "100%" }}>
                <Sidebar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen} />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    flexWrap: "nowrap"
                }}>
                    <Navbar
                        userName={cookies.userName}
                        pageName={"Detail Akun Pengguna"}
                        pageLogo={<BoxSeam size={30} />}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                    <div style={{ paddingBottom: 30 }}></div>
                    <Container fluid style={{
                        display: "flex",
                        flex: 1,
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
                            backgroundSize: "25%",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundPositionX: "center",
                            opacity: 0.1,
                            pointerEvents: "none",
                            zIndex: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.5)" 
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
                                flexDirection: "row",
                                flexWrap: "nowrap",
                                borderBottomStyle: "inset"
                            }}>
                              
                                <div style={{ display: "flex", alignItems: "center", fontSize: 35 }}>Ganti Kata Sandi</div>
                            </div>

                            <div style={{ paddingBottom: 30 }}></div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                flexWrap: "nowrap",
                                padding: 10
                            }}>
                                 <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    resetPassword();
                                }} style={{ padding: 10 }}>



                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        paddingBottom: 10
                                    }}>
                                        <Form.Group className="mb3">
                                            <Form.Label>Kata Sandi</Form.Label>
                                            <Form.Control type="password" onChange={(e) => {
                                                setNewPassword(e.target.value);
                                            }} value={newPassword} required></Form.Control>
                                            <span style={{ color: "red" }}>{errorPasswordLength}</span>
                                        </Form.Group>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        paddingBottom: 10
                                    }}>
                                        <Form.Group className="mb3">
                                            <Form.Label>Konfirmasi Kata Sandi</Form.Label>
                                            <Form.Control onChange={(e) => {
                                                setNewPasswordConfirmation(e.target.value);
                                            }} value={newPasswordConfirmation} required></Form.Control>
                                            <span style={{ color: "red" }}>{errrorMessage}</span>
                                        </Form.Group>
                                    </div>


                                    <div style={{ paddingBottom: 10 }}></div>
                                    <div style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "center",
                                        flex: 1,
                                    }}>
                                        <Button style={{ width: 100 }} variant="primary" type="submit" disabled={buttonReset}>
                                            Simpan
                                        </Button>
                                        <div style={{ paddingRight: 10 }}></div>
                                        <Button style={{ width: 100 }} className="cancel" variant="danger" onClick={() => {
                                            setModalChangePassword(false);
                                        }}>
                                            Batal
                                        </Button>
                                    </div>
                                </Form>

                            </div>




                            <LoadingAnimation
                                isLoading={isLoading}
                            />


                        </div >

                        <Modal show={modalChangePassword}
                            // dialogClassName="modal-size"
                            size={"medium"}
                            onHide={() => {
                                setModalChangePassword(false);
                            }}>
                            <div className="details m-2" >
                                <div className="detailscontent">
                                    <h3>Reset Kata Sandi </h3>
                                </div>

                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    resetPassword();
                                }} style={{ padding: 10 }}>



                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        paddingBottom: 10
                                    }}>
                                        <Form.Group className="mb3">
                                            <Form.Label>Kata Sandi</Form.Label>
                                            <Form.Control type="password" onChange={(e) => {
                                                setNewPassword(e.target.value);
                                            }} value={newPassword} required></Form.Control>
                                            <span style={{ color: "red" }}>{errorPasswordLength}</span>
                                        </Form.Group>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        paddingBottom: 10
                                    }}>
                                        <Form.Group className="mb3">
                                            <Form.Label>Konfirmasi Kata Sandi</Form.Label>
                                            <Form.Control onChange={(e) => {
                                                setNewPasswordConfirmation(e.target.value);
                                            }} value={newPasswordConfirmation} required></Form.Control>
                                            <span style={{ color: "red" }}>{errrorMessage}</span>
                                        </Form.Group>
                                    </div>


                                    <div style={{ paddingBottom: 10 }}></div>
                                    <div style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "center",
                                        flex: 1,
                                    }}>
                                        <Button style={{ width: 100 }} variant="primary" type="submit" disabled={buttonReset}>
                                            Simpan
                                        </Button>
                                        <div style={{ paddingRight: 10 }}></div>
                                        <Button style={{ width: 100 }} className="cancel" variant="danger" onClick={() => {
                                            setModalChangePassword(false);
                                        }}>
                                            Batal
                                        </Button>
                                    </div>
                                </Form>



                            </div>

                        </Modal>

                    </Container >
                </div>
            </div >

        </>
    )
}