import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Table, Modal } from "react-bootstrap";
import {
    Search, BoxSeam, PencilFill, Trash, Download, FileWord, FileEarmarkText, ChevronDoubleLeft, ChevronDoubleRight,
    FilePlusFill, ArrowClockwise, GearWideConnected, EyeFill, Eye, InfoCircleFill, ZoomIn, ZoomOut, AspectRatioFill,
    XSquareFill,
    CheckLg
} from "react-bootstrap-icons";
import "../../../App.css"
import { Container } from "react-bootstrap";
import {
    isTokenValid, insertUpdateUserAccount, getUserAccountById, updatePassword, getAccountType
} from "../../../Helpers/ApplicationHelper";
import Sidebar from "../../../Components/Sidebar";
import LoadingAnimation from "../../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from "../../../Components/Navbar";
import Select from "react-select";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import backLogo from "../../../Assets/images/leftArrow.png"
import webLogo from "../../../Assets/images/log-silikon-removebg-preview.png"


import { triggerBase64Download } from "../../../Helpers/Base64Downloader";
import ContainerBox from "../../../Components/ContainerBox";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function UserAccountDetailPage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const [buttonReset, setButtonReset] = useState("");
    const location = useLocation();
    const [disabledButton, setDisabledButton] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [listAccountType, setListAccountType] = useState([]);
    const [userChangePasswordId, setUserChangePasswordId] = useState("");
    const [modalChangePassword, setModalChangePassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPasswordLength, setErroPasswordLength] = useState("");
    const [userId, setUserId] = useState("");
    const [userAccount, setUserAccount] = useState({
        id: 0,
        username: "",
        password: "",
        name: "",
        confirmation_password: "",
        email: "",
        user_role: null,
        account_type: null
    })


    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                setUserId(location.state.userId);
                loadAccountType();
                // loadPackage();
                if (location.state.userId === 0) {
                    setIsLoading(false);
                }
            }
        }
        checkCookies();
    }, [location.state]);


    useEffect(() => {
        if (userId !== 0 && userId !== "") {
            initUserAccount()
        }
    }, [userId])

    useEffect(() => {
        if (userChangePasswordId !== "") {
            setModalChangePassword(true);
        }
    }, [userChangePasswordId])

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


    useEffect(() => {
        if (!modalChangePassword) {
            setNewPassword("");
            setErroPasswordLength("");
            setErrorMessage("");
            setNewPasswordConfirmation("");
            setUserChangePasswordId("");
        }
    })



    const initUserAccount = async () => {
        try {
            let response = await getUserAccountById(cookies.token, userId);
            if (response) {
                setUserAccount({
                    ...userAccount,
                    id: response.id,
                    username: response.username,
                    name: response.name,
                    email: response.email,
                    user_role:response.user_role,
                    account_type: response.account_type
                })
            }
            setIsLoading(false);

        } catch (exception) {

        }
    }

    const saveData = async () => {
        try {
            let response = await insertUpdateUserAccount(cookies.token, userAccount);
            if (response.error_code === 0) {
                alert('Data Berhasil Disimpan');
                navigate('/UserAccount')
            } else {
                alert('Gagal Menyimpan Data');
            }
            setDisabledButton(false)

        } catch (exception) {

        }
    }

    const resetPassword = async () => {
        try {
            let response = await updatePassword(cookies.token, location.state.userId, newPassword);
            if (response === 0) {
                alert('Berhasil Mengganti Password');
                setModalChangePassword("");
            } else {
                alert('Gagal Mengganti Password');
            }
        } catch (exception) {

        }
    }

    const loadAccountType = async () => {
        try {
            let response = await getAccountType(cookies.token);
            setListAccountType(response);
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
                                <div onClick={() => {
                                    navigate("/UserAccount")
                                }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><img src={backLogo} alt="Icon" style={{ width: '50px', height: '50px' }} /></div>
                                <div style={{ paddingRight: 10 }}></div>
                                <div style={{ display: "flex", alignItems: "center", fontSize: 35 }}>Detail Pengguna</div>
                            </div>

                            <div style={{ paddingBottom: 30 }}></div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                flexWrap: "nowrap",
                                padding: 10
                            }}>
                                <Form className="detailPackageForm" onSubmit={(e) => {
                                    e.preventDefault();
                                    setIsLoading(true);
                                    setDisabledButton(true);
                                    saveData()
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        paddingBottom: 10
                                    }}>
                                        <Form.Group className="mb3">
                                            <Form.Label>Akun Pengguna</Form.Label>
                                            <Form.Control onChange={(e) => {
                                                setUserAccount({ ...userAccount, username: e.target.value });
                                            }} value={userAccount.username} required></Form.Control>
                                        </Form.Group>

                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        paddingBottom: 10
                                    }}>
                                        <Form.Group className="mb3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control onChange={(e) => {
                                                setUserAccount({ ...userAccount, email: e.target.value });
                                            }} value={userAccount.email} required></Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        paddingBottom: 10
                                    }}>
                                        <Form.Group className="mb3">
                                            <Form.Label>Nama </Form.Label>
                                            <Form.Control onChange={(e) => {
                                                setUserAccount({ ...userAccount, name: e.target.value });
                                            }} value={userAccount.name} ></Form.Control>
                                        </Form.Group>

                                    </div>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Jabatan</Form.Label>
                                        <Form.Select onChange={(e) => {
                                            setUserAccount({ ...userAccount, user_role: e.target.value })
                                        }} value={userAccount.user_role} required>
                                            <option value={""} selected disabled></option>
                                            <option value={1} >PPK</option>
                                            <option value={2} >PPTK</option>
                                            <option value={4} >Penyedia</option>


                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Jenis Akun</Form.Label>
                                        <Form.Select onChange={(e)=>{
                                            setUserAccount({...userAccount, account_type: e.target.value})
                                        }} value={userAccount.account_type} required>
                                            <option value={""} selected disabled></option>

                                            {listAccountType.map((types, index) => {
                                                return (
                                                    <option value={types.id} key={index}>{types.type_name}</option>
                                                )
                                            })}

                                        </Form.Select>
                                    </Form.Group>

                                    {
                                        location.state.userId === 0 &&
                                        <>

                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                flex: 1,
                                                paddingBottom: 10
                                            }}>
                                                <Form.Group className="mb3">
                                                    <Form.Label>Kata Sandi</Form.Label>
                                                    <Form.Control type="password" onChange={(e) => {
                                                        setUserAccount({ ...userAccount, password: e.target.value });
                                                    }} value={userAccount.password} required></Form.Control>
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
                                                        setUserAccount({ ...userAccount, confirmation_password: e.target.value });
                                                    }} value={userAccount.confirmation_password} required></Form.Control>
                                                    <span style={{ color: "red" }}>{errrorMessage}</span>
                                                </Form.Group>
                                            </div>


                                        </>
                                    }










                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        padding: 10,
                                        justifyContent: "center"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            paddingRight: 5
                                        }}>
                                            <Button disabled={disabledButton} style={{ width: 100, zIndex: 999 }} type="submit">Simpan</Button>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            paddingLeft: 5,
                                            paddingRight: 5
                                        }}>
                                            <Button style={{ width: 100, zIndex: 999 }} type="reset" variant="danger" onClick={(e) => {
                                                navigate('/Package')
                                            }}>Batal</Button>
                                        </div>
                                        {
                                            location.state.userId !== 0 &&
                                            <div style={{
                                                display: "flex",
                                                paddingLeft: 5,
                                                paddingRight: 5
                                            }}>
                                                <Button style={{ width: 150, zIndex: 999 }} type="reset" variant="info" onClick={(e) => {
                                                    setUserChangePasswordId(location.state.userId);
                                                }}>Ganti Kata Sandi</Button>
                                            </div>
                                        }



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