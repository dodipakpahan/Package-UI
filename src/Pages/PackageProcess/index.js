import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { FilePlusFill, Search, ArrowClockwise, BoxSeam, PencilFill, Trash, Download , EyeFill} from "react-bootstrap-icons";
import "../../App.css"
import { Container } from "react-bootstrap";
import { isTokenValid, getPackage, getCountPackage, deletePackage } from "../../Helpers/ApplicationHelper";
import Sidebar from "../../Components/Sidebar";
import LoadingAnimation from "../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import Paginations from "../../Components/Pagination";

export default function PackageProcessPage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
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
    },{
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
            let countryCount = await getCountPackage(cookies.token, searchQuery, false);
            let totalPage = countryCount / itemPerPage;
            setTotalPage(totalPage);

            let response = await getPackage(cookies.token, page, itemPerPage, orderBy.value, descending, searchQuery, false);
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
                                    }}><BoxSeam size={40} /> <h1> Halaman Proses Paket</h1></div>

                                </div>

                            </div>

                        </div>
                        <div>  <hr></hr></div>

                        
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

                            <div className="table-container">
                                <div className="table-header">
                                    <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">#</div>
                                    <div style={{ flex: 3, justifyContent: "center" }} className="table-header-content">Nama Paket</div>
                                    <div style={{ flex: 2, justifyContent: "center" }} className="table-header-content">Tanggal Paket</div>
                                    <div style={{ flex: 2, justifyContent: "center" }} className="table-header-content">Tanggal Input Data</div>
                                    <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">Detail</div>
                               
                                </div>
                                {
                                    listPackage.map((packages, index) => {
                                        return (<div className="table-body" key={index}>
                                            <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content"><p>{(page * (itemPerPage)) + (index + 1)}</p></div>
                                            <div style={{ flex: 3 }} className="table-body-content"><p>{packages.package_name}</p></div>
                                            <div style={{ flex: 2, justifyContent: "center" }} className="table-body-content"><p>{moment(packages.package_date).format("DD-MM-YYYY")}</p></div>
                                            <div style={{ flex: 2, justifyContent: "center" }} className="table-body-content"><p>{moment(packages.created_date).format("DD-MM-YYYY")}</p></div>
                                            <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content">
                                                <div style={{ padding: 5 }}>
                                                    <Button variant="primary" onClick={() => {
                                                        navigate("/PackageProcess/Detail", { state: { packageId: packages.id } });
                                                    }}><EyeFill />
                                                    </Button>
                                                </div></div>
                                            
                                        


                                        </div>)
                                    }
                                    )
                                }
                            </div>
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

        </>
    )
}