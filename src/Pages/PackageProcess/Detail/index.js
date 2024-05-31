import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { FilePlusFill, Search, ArrowClockwise, BoxSeam, PencilFill, Trash, Download } from "react-bootstrap-icons";
import "../../../App.css"
import { Container } from "react-bootstrap";
import { isTokenValid, insertUpdatePackage, getPackageById, convertBase64 } from "../../../Helpers/ApplicationHelper";
import Sidebar from "../../../Components/Sidebar";
import LoadingAnimation from "../../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";


export default function DetailPAckageProcessPage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [disabledButton, setDisabledButton] = useState(false);
    const [packageId, setPackageId] = useState("");
    const [packages, setPackages] = useState({
        id: 0,
        package_name: "",
        package_date: "",
        upload_document: ""
    })


    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                setPackageId(location.state.packageId)
                // loadPackage();
                if (location.state.packageId === 0) {
                    setIsLoading(false);
                }
            }
        }
        checkCookies();
    }, []);

    useEffect(() => {
        if (packageId !== 0 && packageId !== "") {
            initDataPackage()
        }
    }, [packageId])

    const initDataPackage = async () => {
        try {
            let response = await getPackageById(cookies.token, packageId);
            console.log(response);
            if (response) {
                setPackages({
                    ...packages,
                    id: response.id,
                    package_name: response.package_name,
                    package_date: response.package_date,
                    upload_document: response.upload_document
                })
            }
            setIsLoading(false);

        } catch (exception) {

        }
    }

    const saveData = async () => {
        try {
            let response = await insertUpdatePackage(cookies.token, packages);
            if (response.error_code === 0) {
                alert('Data Berhasil Disimpan');
                if (packageId === 0) {

                    setPackageId(response.data.id)
                } else {
                    initDataPackage();
                }
            } else {
                alert('Gagal Menyimpan Data')
            }
            setDisabledButton(false)

        } catch (exception) {

        }
    }


    return (
        <>

            <div style={{ display: "flex", height: "100%" }}>
                <Sidebar />
                <Container fluid style={{
                    display: "flex",
                    flex: 1,
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
                        <div style={{
                            display: 'flex',
                            flexDirection: "row",
                            width: "100%",
                            flexWrap: "nowrap"
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                flex: 1,
                                justifyContent: "flex-start",
                            }}>
                                <div style={{
                                    display: "flex",
                                    flex: 1,
                                    alignContent: "center",
                                    alignItems: "center",
                                    // justifyContent: "center",
                                    flexDirection: "row",
                                    alignSelf: "center",
                                }}>
                                    <div style={{
                                        display: "flex",
                                        alignContent: "center",
                                        alignItems: "center",
                                        // justifyContent: "center",
                                        alignSelf: "center",
                                        flex: 1,
                                    }}><BoxSeam size={40} /> <h1> Detail Paket</h1></div>

                                </div>

                            </div>

                        </div>
                        <div>  <hr></hr></div>
                       {
                            packages.upload_document === "" || packages.upload_document === null ?
                            <div style={{
                                display:"flex",
                                justifyContent:"center"
                            }}>
                                <h1>Laporan BPBJ Belum DiUplad</h1>
                            </div>
                            :
                            <div style={{
                                display:"flex"
                            }}>
                                <p>Tahap Paket</p>
                            </div>
                       }




                        <LoadingAnimation
                            isLoading={isLoading}
                        />


                    </div>

                </Container>

            </div>

        </>
    )
}