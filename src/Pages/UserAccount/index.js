import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { FilePlusFill, Search, ArrowClockwise, BoxSeam, PencilFill, Trash, Download, HourglassSplit } from "react-bootstrap-icons";
import "../../App.css"
import { Container } from "react-bootstrap";
import { isTokenValid, getUserAccount, getCountUserAccount, deleteUserAccount } from "../../Helpers/ApplicationHelper";
import Sidebar from "../../Components/Sidebar";
import LoadingAnimation from "../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import Paginations from "../../Components/Pagination";
import Navbar from "../../Components/Navbar";
import webLogo from "../../Assets/images/log-silikon-removebg-preview.png"


export default function UserAccountPage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [isSearched, setIsSearched] = useState(0);
    const [resetSearch, setResetSearch] = useState(0);
    const [page, setPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(50);
    const [descending, setDescending] = useState(false);
    const [removeId, setRemoveId] = useState("");
    const [totalPage, setTotalPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [itemPerPageSelection, setItemPerPageSelection] = useState([5, 10, 15, 20, 50]);
    // const [orderBy, setOrderBy] = useState({
    //     label: ``,
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
                loadUserAccount();

            }
        }
        checkCookies();
    }, []);
    useEffect(() => {
        // if (isSearched !== 0)
        loadUserAccount();
    }, [page]);

    useEffect(() => {
        if (isSearched !== 0)
            loadUserAccount();
    }, [itemPerPage]);

    // useEffect(() => {
    //     if (isSearched !== 0)
    //         loadUserAccount();
    // }, [orderBy]);


    useEffect(() => {
        if (resetSearch !== 0) {
            loadUserAccount()
        }
    }, [resetSearch])

    useEffect(() => {
        if (isSearched !== 0)
            loadUserAccount()
    }, [descending]);

    useEffect(() => {
        if (removeId !== "")
            removePackage();
    }, [removeId])



    const loadUserAccount = async () => {
        try {
            let countryCount = await getCountUserAccount(cookies.token, searchQuery, false);
            let totalPage = countryCount / itemPerPage;
            setTotalPage(totalPage);

            let response = await getUserAccount(cookies.token, page, itemPerPage, undefined, descending, searchQuery, false);
            setListUser(response)
            setIsLoading(false);
            setResetSearch(0);
            setIsSearched(0);
        } catch (exception) {
            console.log(exception)
        }
    }

    const removePackage = async () => {
        try {
            let response = await deleteUserAccount(cookies.token, removeId);
            if (response === 0) {
                alert(`Data Telah Dihapus`);
                loadUserAccount();
            } else {
                alert('Gagal Menghapus Data')
            }
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
                                <div style={{ display: "flex", alignItems: "center", fontSize: 35 }}>Akun Pengguna</div>
                            </div>

                            <div style={{ paddingBottom: 10 }}></div>
                            <div hidden={cookies.userRole !== 1} style={{
                                display: "flex",
                                maxWidth: 250,

                            }}>
                                <Button variant="primary" style={{

                                }} onClick={() => {
                                    navigate("/UserAccount/Detail", { state: { userId: 0 } })
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
                                        <Form.Control value={searchQuery} type="text" placeholder={`Akun Pengguna, Nama`}
                                            onKeyPress={async (e) => {
                                                if (e.charCode === 13) {
                                                    setPage(0);
                                                    setIsLoading(true);
                                                    await loadUserAccount();
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
                                                await loadUserAccount();
                                            }}><Search /></Button>
                                        </div>
                                        <div style={{ paddingLeft: 5 }}>
                                            <Button variant="primary" onClick={async () => {
                                                setIsLoading(true);
                                                setSearchQuery("");
                                                setResetSearch(1);
                                                await loadUserAccount();
                                            }}><ArrowClockwise /></Button>
                                        </div>

                                    </div>
                                </div>

                                {/* <div className="table-container">
                                    <div className="table-header">
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">#</div>
                                        <div style={{ flex: 3, justifyContent: "center" }} className="table-header-content">User Id</div>
                                        <div style={{ flex: 1, justifyContent: "center" }} className="table-header-content">Name</div>
                                        <div style={{ flex: 0.6, justifyContent: "center" }} className="table-header-content">Detail</div>
                                        <div style={{ flex: 0.6, justifyContent: "center" }} className="table-header-content">Hapus</div>

                                    </div>
                                    {
                                        listUser.map((users, index) => {
                                            return (<div className="table-body" key={index}>
                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content"><p>{(page * (itemPerPage)) + (index + 1)}</p></div>
                                                <div style={{ flex: 3 }} className="table-body-content"><p>{users.username}</p></div>
                                                <div style={{ flex: 1, justifyContent: "center" }} className="table-body-content"><p>{users.name}</p></div>
                                                <div style={{ flex: 0.6, justifyContent: "center" }} className="table-body-content">
                                                    <div style={{ padding: 5 }}>
                                                        <Button variant="primary" onClick={() => {
                                                            navigate("/UserAccount/Detail", { state: { userId: users.id } });
                                                        }}><PencilFill />
                                                        </Button>
                                                    </div></div>


                                                <div style={{ flex: 0.6, justifyContent: "center" }} className="table-body-content">
                                                    <div style={{ padding: 5 }}>
                                                        <Button variant="danger" onClick={() => {
                                                            if (window.confirm(`Apakah anda ingin menghapus data ${users.user_name}`))
                                                                setRemoveId(users.id)
                                                        }}><Trash />
                                                        </Button>
                                                    </div></div>


                                            </div>)
                                        }
                                        )
                                    }
                                </div> */}
                                <Table className="packageTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Akun Pengguna</th>
                                            <th>Nama Penyedia</th>
                                            <th>Detail</th>
                                            <th>Hapus</th>

                                        </tr>
                                    </thead>
                                    {
                                        listUser.map((users, index) => {
                                            return (
                                                <tbody key={users.id}>
                                                    <tr>
                                                        <td style={{textAlign:"center"}}>{index + 1}</td>
                                                        <td >{users.username}</td>
                                                        <td >{users.name}</td>

                                                        <td >
                                                            <div className="buttonContainer" >
                                                                <Button variant="primary" onClick={() => {
                                                                    navigate("/UserAccount/Detail", { state: { userId: users.id } });
                                                                }}><PencilFill />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                      
                                                        <td >
                                                            <div className="buttonContainer" >
                                                                <Button variant="danger" onClick={() => {
                                                                    if (window.confirm(`Apakah anda ingin menghapus data ${users.user_name}`))
                                                                        setRemoveId(users.id)
                                                                }}><Trash />
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
                                <div style={{
                                    paddingTop: 20,
                                }}>

                                </div>
                                <Paginations
                                    itemPerPage={itemPerPage}
                                    totalPage={totalPage}
                                    page={page}
                                    setPage={setPage}
                                    // setItemPerPage={setItemPerPage}
                                    // itemPerPageSelection={itemPerPageSelection}
                                    // orderBy={orderBy}
                                    // setOrderBy={setOrderBy}
                                    // orderBySelection={orderByList}
                                    // isDescActive={descending}
                                    // setIsDescActive={setDescending}
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