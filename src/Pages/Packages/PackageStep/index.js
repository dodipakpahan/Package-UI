import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { FilePlusFill, Search, ArrowClockwise, BoxSeam, PencilFill, Trash, Download, HourglassSplit, EyeFill } from "react-bootstrap-icons";
import "../../../App.css"
import { Container, Table } from "react-bootstrap";
import { isTokenValid, getPackageStep } from "../../../Helpers/ApplicationHelper";
import Sidebar from "../../../Components/Sidebar";
import LoadingAnimation from "../../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import webLogo from "../../../Assets/images/log-silikon-removebg-preview.png"
import Paginations from "../../../Components/Pagination";
import Navbar from "../../../Components/Navbar";
import backLogo from "../../../Assets/images/leftArrow.png"

export default function PackageStep() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [listStep, setListStep] = useState([]);
    const location = useLocation();

    // const [isSearched, setIsSearched] = useState(0);
    // const [resetSearch, setResetSearch] = useState(0);
    // const [page, setPage] = useState(0);
    // const [itemPerPage, setItemPerPage] = useState(50);
    // const [descending, setDescending] = useState(false);
    // const [removeId, setRemoveId] = useState("");
    // const [totalPage, setTotalPage] = useState(0);
    // const [searchQuery, setSearchQuery] = useState("");
    // const [itemPerPageSelection, setItemPerPageSelection] = useState([5, 10, 15, 20, 50]);
    // const [orderBy, setOrderBy] = useState({
    //     label: `Nama Paket`,
    //     value: "package_name"
    // });
    // const orderByList = [{
    //     label: `Nama Paket`,
    //     value: "package_mame"
    // }, {
    //     label: "Tanggal Input",
    //     value: "created_date"
    // }, {
    //     label: "Tanggal Paket",
    //     value: "package_date"
    // }];

    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                loadPackageStep();

            }
        }
        checkCookies();
    }, []);
    // useEffect(() => {
    //     // if (isSearched !== 0)
    //     loadPackageStep();
    // }, [page]);

    // useEffect(() => {
    //     if (isSearched !== 0)
    //         loadPackageStep();
    // }, [itemPerPage]);

    // useEffect(() => {
    //     if (isSearched !== 0)
    //         loadPackageStep();
    // }, [orderBy]);


    // useEffect(() => {
    //     if (resetSearch !== 0) {
    //         loadPackageStep()
    //     }
    // }, [resetSearch])

    // useEffect(() => {
    //     if (isSearched !== 0)
    //         loadPackageStep()
    // }, [descending]);

    // useEffect(() => {
    //     if (removeId !== "")
    //         removePackage();
    // }, [removeId])



    const loadPackageStep = async () => {
        try {

            let response = await getPackageStep(cookies.token, location.state.packageId);
            setListStep(response)
            setIsLoading(false);
        } catch (exception) {
            console.log(exception)
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
                        pageName={"Daftar Tahapan"}
                        pageLogo={<BoxSeam size={30} />}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                    <div style={{ paddingBottom: 30 }}></div>
                    <Container fluid style={{
                        display: "flex",
                        flex: 1,
                        paddingRight: 20,
                        paddingLeft: 20
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
                                    navigate('/Package');
                                }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><img src={backLogo} alt="Icon" style={{ width: '50px', height: '50px' }} /></div>
                                <div style={{ paddingRight: 10 }}></div>
                                <div style={{ display: "flex", alignItems: "center", fontSize: 35 }}>Tahapan Paket</div>
                            </div>

                            <div style={{ paddingBottom: 30 }}></div>

                            <div className="master-table-inner-container">


                                <Table className="packageTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Tahapan</th>
                                            <th>Status Tahapan</th>
                                            <th>Detail</th>

                                        </tr>
                                    </thead>
                                    {listStep.map((steps, index) => {
                                        return (
                                            <tbody key={steps.id}>
                                                <tr>
                                                    <td style={{textAlign:"center"}} >{index + 1}</td>
                                                    <td >{steps.step_name}</td>
                                                    <td style={{textAlign:"center"}}>{steps.status_name}</td>
                                                    <td >
                                                        <div className="buttonContainer" >
                                                            <Button disabled={Number(steps.package_step) < index || !steps.package_step} variant="primary" onClick={() => {
                                                                navigate(`${steps.path}`, { state: { stepId: steps.id, orderNumber: steps.order_number, packageId: steps.package_id } });
                                                            }}><EyeFill />
                                                            </Button>
                                                        </div>
                                                    </td>

                                                </tr>
                                            </tbody>
                                        )
                                    }
                                    )
                                    }
                                </Table>
                                {/* <div className="table-container">
                                    <div className="table-header">
                                        <div style={{ flex: 0.5, justifyContent: "center" }} className="table-header-content">#</div>
                                        <div style={{ flex: 5, justifyContent: "center" }} className="table-header-content">Nama Tahapan</div>
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">Status Tahapan</div>
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">Detail</div>


                                    </div>
                                    {listStep.map((steps, index) => {
                                            return (<div className="table-body" key={index}>
                                                <div style={{ flex: 0.5, justifyContent: "center" }} className="table-body-content"><p>{index + 1}</p></div>
                                                <div style={{ flex: 5 }} className="table-body-content"><p>{steps.step_name}</p></div>
                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content"><p>{steps.status_name}</p></div>

                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content">
                                                    <div style={{ padding: 5 }}>
                                                        <Button disabled={Number(steps.package_step) < index || !steps.package_step} variant="primary" onClick={() => {
                                                            navigate(`${steps.path}`, { state: { stepId: steps.id, orderNumber: steps.order_number, packageId: steps.package_id } });
                                                        }}><EyeFill />
                                                        </Button>
                                                    </div></div>



                                            </div>)
                                        }
                                        )
                                    }
                                </div> */}
                                <div style={{
                                    paddingTop: 20,
                                }}>

                                </div>



                                {/*
<Loading
    loading={loading}
/> */}
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