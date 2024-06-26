import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { FilePlusFill, Search, ArrowClockwise, BoxSeam, PencilFill, Trash, Download, HourglassSplit } from "react-bootstrap-icons";
import "../../App.css"
import { Container } from "react-bootstrap";
import { isTokenValid, getPackage, getCountPackage, deletePackage } from "../../Helpers/ApplicationHelper";
import Sidebar from "../../Components/Sidebar";
import LoadingAnimation from "../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import Paginations from "../../Components/Pagination";
import Navbar from "../../Components/Navbar";
import webLogo from "../../Assets/images/log-silikon-removebg-preview.png"


export default function PackagePage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [listPackage, setListPackage] = useState([]);
    const [isSearched, setIsSearched] = useState(0);
    const [resetSearch, setResetSearch] = useState(0);
    const [page, setPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(50);
    const [descending, setDescending] = useState(false);
    const [removeId, setRemoveId] = useState("");
    const [totalPage, setTotalPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [itemPerPageSelection, setItemPerPageSelection] = useState([5, 10, 15, 20, 50]);
    const [orderBy, setOrderBy] = useState({
        label: `Nama Paket`,
        value: "package_name"
    });
    const orderByList = [{
        label: `Nama Paket`,
        value: "package_mame"
    }, {
        label: "Tanggal Input",
        value: "created_date"
    }, {
        label: "Tanggal Paket",
        value: "package_date"
    }];

    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                loadPackage();

            }
        }
        checkCookies();
    }, []);
    useEffect(() => {
        // if (isSearched !== 0)
        loadPackage();
    }, [page]);

    useEffect(() => {
        if (isSearched !== 0)
            loadPackage();
    }, [itemPerPage]);

    useEffect(() => {
        if (isSearched !== 0)
            loadPackage();
    }, [orderBy]);


    useEffect(() => {
        if (resetSearch !== 0) {
            loadPackage()
        }
    }, [resetSearch])

    useEffect(() => {
        if (isSearched !== 0)
            loadPackage()
    }, [descending]);

    useEffect(() => {
        if (removeId !== "")
            removePackage();
    }, [removeId])



    const loadPackage = async () => {
        try {
            let countryCount = await getCountPackage(cookies.token, searchQuery, false, cookies.userRole);
            let totalPage = countryCount / itemPerPage;
            setTotalPage(totalPage);

            let response = await getPackage(cookies.token, page, itemPerPage, orderBy.value, descending, searchQuery, false, cookies.userRole);
            console.log(response);
            setListPackage(response)
            setIsLoading(false);
            setResetSearch(0);
            setIsSearched(0);
        } catch (exception) {
            console.log(exception)
        }
    }

    const removePackage = async () => {
        try {
            let response = await deletePackage(cookies.token, removeId);
            if (response === 0) {
                alert(`Data Telah Dihapus`);
                loadPackage();
            }
        } catch (exception) {

        }
    }

    // const styles = {
    //     th: {
    //         border: '1px solid #ddd',
    //         padding: '8px',
    //         backgroundColor: '#f2f2f2',
    //         textAlign: 'left'
    //     },
    //     td: {
    //         border: '1px solid #ddd',
    //         padding: '8px',
    //     },
    //     buttonContainer: {
    //         padding: 5,
    //     }
    // };

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
                        pageName={"Paket"}
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
                                {/* <div style={{ display: "flex", alignItems: "center" }}><img src={weblogo} alt="Icon" style={{ width: '50px', height: '50px' }} /></div>
                                <div style={{ paddingRight: 10 }}></div> */}
                                <div style={{ display: "flex", alignItems: "center", fontSize: 35 }}>Paket</div>
                            </div>

                            <div style={{ paddingBottom: 10 }}></div>
                            <div hidden={cookies.userRole !== 2} style={{
                                display: "flex",
                                maxWidth: 250,

                            }}>
                                <Button variant="primary" style={{

                                }} onClick={() => {
                                    navigate("/Package/Detail", { state: { packageId: 0 } })
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flex: 1,
                                        alignContent: "center",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "row",
                                        alignSelf: "center",
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignContent: "center",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            flex: 1,
                                        }}><FilePlusFill size={32} /></div>
                                        <div style={{
                                            display: "flex",
                                            flex: 8,
                                            alignContent: "center",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            paddingLeft: 10,
                                            fontWeight: "bold",
                                            fontSize: 18,
                                        }}>Tambah Data</div>
                                    </div>
                                </Button>
                            </div>
                            <div className="master-table-inner-container">

                                <div className="master-table-searchbar-container">
                                    <div className="master-table-searchbar-textbox">
                                        <Form.Control value={searchQuery} type="text" placeholder={`Nama Paket`}
                                            onKeyPress={async (e) => {
                                                if (e.charCode === 13) {
                                                    setPage(0);
                                                    setIsLoading(true);
                                                    await loadPackage();
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                            }} />
                                    </div>
                                    <div className="master-table-searchbar-button">
                                        <div style={{ paddingRight: 5 }}>
                                            <Button variant="primary" onClick={async () => {
                                                setIsLoading(true);
                                                setPage(0);
                                                await loadPackage();
                                            }}><Search /></Button>
                                        </div>
                                        <div style={{ paddingLeft: 5 }}>
                                            <Button variant="primary" onClick={async () => {
                                                setIsLoading(true);
                                                setSearchQuery("");
                                                setResetSearch(1);
                                                await loadPackage();
                                            }}><ArrowClockwise /></Button>
                                        </div>

                                    </div>
                                </div>
                                <Table className="packageTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Paket</th>
                                            <th>Status Paket</th>
                                            <th>Metode Pemilihan</th>
                                            <th>Tanggal Mulai</th>
                                            <th>Tanggal Selesai</th>
                                            <th>Detail</th>
                                            <th>Proses Paket</th>
                                            <th>Hapus</th>
                                        </tr>
                                    </thead>
                                    {listPackage.map((packages, index) => (
                                        <tbody key={packages.id}>
                                            <tr>
                                                <td style={{textAlign:"center"}} >{(page * itemPerPage) + (index + 1)}</td>
                                                <td >{packages.package_name}</td>
                                                <td >{packages.status_name}</td>
                                                <td >{packages.selection_methode}</td>
                                                <td >{packages.start_date ? moment(packages.start_date).format("DD-MM-YYYY") : ""}</td>
                                                <td >{packages.end_date ? moment(packages.end_date).format("DD-MM-YYYY") : ""}</td>
                                                <td >
                                                    <div className="buttonContainer" >
                                                        <Button  variant="primary" onClick={() => navigate("/Package/Detail", { state: { packageId: packages.id } })}>
                                                            <PencilFill />
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td >
                                                    <div className="buttonContainer" >
                                                        <Button variant="info" onClick={() => navigate("/Package/Step", { state: { packageId: packages.id } })}>
                                                            <HourglassSplit />
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td >
                                                    <div className="buttonContainer" >
                                                        <Button variant="danger" onClick={() => {
                                                            if (window.confirm(`Apakah anda ingin menghapus data ${packages.package_name}`)) setRemoveId(packages.id);
                                                        }}>
                                                            <Trash />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))}
                                </Table>

                                {/* <div className="table-container">
                                    <div className="table-header">
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">#</div>
                                        <div style={{ flex: 3, justifyContent: "center" }} className="table-header-content">Nama Paket</div>
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">Status Paket</div>
                                        <div style={{ flex: 2, justifyContent: "center" }} className="table-header-content">Metode Pemilihan</div>
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">Tanggal Mulai</div>
                                        <div style={{ flex: 1.2, justifyContent: "center" }} className="table-header-content">Tanggal Selesai</div>
                                        <div style={{ flex: 0.6, justifyContent: "center" }} className="table-header-content">Detail</div>
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">Proses Paket</div>
                                        <div style={{ flex: 0.6, justifyContent: "center" }} className="table-header-content">Hapus</div>

                                    </div>
                                    {
                                        listPackage.map((packages, index) => {
                                            return (<div className="table-body" key={index}>
                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content"><p>{(page * (itemPerPage)) + (index + 1)}</p></div>
                                                <div style={{ flex: 3 }} className="table-body-content"><p>{packages.package_name}</p></div>
                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content"><p>{packages.status_name}</p></div>
                                                <div style={{ flex: 2, justifyContent: "center" }} className="table-body-content"><p>{packages.selection_methode}</p></div>
                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content"><p>{packages.start_date ? moment(packages.start_date).format("DD-MM-YYYY") : ""}</p></div>
                                                <div style={{ flex: 1.2, justifyContent: "center" }} className="table-body-content"><p>{packages.end_date ? moment(packages.end_date).format("DD-MM-YYYY") : ""}</p></div>
                                                <div style={{ flex: 0.6, justifyContent: "center" }} className="table-body-content">
                                                    <div style={{ padding: 5 }}>
                                                        <Button variant="primary" onClick={() => {
                                                            navigate("/Package/Detail", { state: { packageId: packages.id } });
                                                        }}><PencilFill />
                                                        </Button>
                                                    </div></div>
                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content">
                                                    <div style={{ padding: 5 }}>
                                                        <Button variant="primary" onClick={() => {
                                                            navigate("/Package/Step", { state: { packageId: packages.id } });
                                                        }}><HourglassSplit />
                                                        </Button>
                                                    </div></div>

                                                <div style={{ flex: 0.6, justifyContent: "center" }} className="table-body-content">
                                                    <div style={{ padding: 5 }}>
                                                        <Button variant="danger" onClick={() => {
                                                            if (window.confirm(`Apakah anda ingin menghapus data ${packages.package_name}`))
                                                                setRemoveId(packages.id)
                                                        }}><Trash />
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
                                <Paginations
                                    itemPerPage={itemPerPage}
                                    totalPage={totalPage}
                                    page={page}
                                    setPage={setPage}
                                    setItemPerPage={setItemPerPage}
                                    itemPerPageSelection={itemPerPageSelection}
                                    orderBy={orderBy}
                                    setOrderBy={setOrderBy}
                                    orderBySelection={orderByList}
                                    isDescActive={descending}
                                    setIsDescActive={setDescending}
                                    setIsSearched={setIsSearched}
                                />


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