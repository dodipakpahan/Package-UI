import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Table, Modal } from "react-bootstrap";
import { FilePlusFill, Search, ArrowClockwise, BoxSeam, PencilFill, Trash, Download, HourglassSplit } from "react-bootstrap-icons";
import "../../App.css"
import { Container } from "react-bootstrap";
import { isTokenValid, getAccountType, getCountAccountType, deleteAccountType, getAccountTypeById, insertUpdateAccountType } from "../../Helpers/ApplicationHelper";
import Sidebar from "../../Components/Sidebar";
import LoadingAnimation from "../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import Paginations from "../../Components/Pagination";
import Navbar from "../../Components/Navbar";
import webLogo from "../../Assets/images/log-silikon-removebg-preview.png"


export default function AccountTypePage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [listAccountType, setListAccountType] = useState([]);
    const [isSearched, setIsSearched] = useState(0);
    const [resetSearch, setResetSearch] = useState(0);
    const [page, setPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(50);
    const [descending, setDescending] = useState(false);
    const [removeId, setRemoveId] = useState("");
    const [totalPage, setTotalPage] = useState(0);
    const [disabledButton, setDisabledButton] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [accountTypeId, setAccountTypeId] = useState("");
    const [modalAccountType, setModalAccountType] = useState("");
    const [typeAccount, setTypeAccount] = useState({
        id: 0,
        type_name: ""
    })
    const [itemPerPageSelection, setItemPerPageSelection] = useState([5, 10, 15, 20, 50]);

    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                loadAccountType();

            }
        }
        checkCookies();
    }, []);
    useEffect(() => {
        // if (isSearched !== 0)
        loadAccountType();
    }, [page]);

    useEffect(() => {
        if (isSearched !== 0)
            loadAccountType();
    }, [itemPerPage]);

    // useEffect(() => {
    //     if (isSearched !== 0)
    //         loadAccountType();
    // }, [orderBy]);


    useEffect(() => {
        if (resetSearch !== 0) {
            loadAccountType()
        }
    }, [resetSearch])

    useEffect(() => {
        if (isSearched !== 0)
            loadAccountType()
    }, [descending]);

    useEffect(() => {
        if (removeId !== "")
            removeData();
    }, [removeId])

    useEffect(() => {
        if (accountTypeId !== "" && accountTypeId !== undefined)
            initAccountType();
    }, [accountTypeId]);

    useEffect(() => {
        if (!modalAccountType)
            setAccountTypeId("");
    }, [modalAccountType])


    const initAccountType = async () => {
        try {
            let response = await getAccountTypeById(cookies.token, accountTypeId);
            console.log(response);
            if (response) {
                setTypeAccount(response);
            }
            setModalAccountType(true);
        } catch (exception) {

        }
    }


    const loadAccountType = async () => {
        try {
            let responseCount = await getCountAccountType(cookies.token, searchQuery, false);
            let totalPage = responseCount / itemPerPage;
            setTotalPage(totalPage);

            let response = await getAccountType(cookies.token, page, itemPerPage, undefined, descending, searchQuery, false);
            setListAccountType(response)
            setIsLoading(false);
            setResetSearch(0);
            setIsSearched(0);
        } catch (exception) {
            console.log(exception)
        }
    }

    const removeData = async () => {
        try {
            let response = await deleteAccountType(cookies.token, removeId);
            if (response === 0) {
                alert(`Data Telah Dihapus`);
                loadAccountType();
            } else {
                alert('Gagal Menghapus Data')
            }
        } catch (exception) {

        }
    }

    const clearTypeAccount = async () => {
        let typeTmp = {};
        typeTmp.id = 0;
        typeTmp.type_name = "";
        setTypeAccount(typeTmp);
    }

    const saveData = async () => {
        try {
            let response = await insertUpdateAccountType(cookies.token, typeAccount);
            if (response.error_code === 0) {
                alert('Berhasil Menyimpan Data')
                clearTypeAccount();
                setModalAccountType(false);
                loadAccountType();
            } else {
                alert('Data Gagal Disimpan');
            }
            setDisabledButton(false)
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
                                <div style={{ display: "flex", alignItems: "center", fontSize: 35 }}>Jenis Akun</div>
                            </div>

                            <div style={{ paddingBottom: 10 }}></div>
                            <div hidden={cookies.userRole !== 1} style={{
                                display: "flex",
                                maxWidth: 250,

                            }}>
                                <Button variant="primary" style={{

                                }} onClick={() => {
                                   setModalAccountType(true);
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
                                        <Form.Control value={searchQuery} type="text" placeholder={`Jenis Akun`}
                                            onKeyPress={async (e) => {
                                                if (e.charCode === 13) {
                                                    setPage(0);
                                                    setIsLoading(true);
                                                    await loadAccountType();
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
                                                await loadAccountType();
                                            }}><Search /></Button>
                                        </div>
                                        <div style={{ paddingLeft: 5 }}>
                                            <Button variant="primary" onClick={async () => {
                                                setIsLoading(true);
                                                setSearchQuery("");
                                                setResetSearch(1);
                                                await loadAccountType();
                                            }}><ArrowClockwise /></Button>
                                        </div>

                                    </div>
                                </div>


                                <Table className="packageTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Jenis</th>
                                            <th>Detail</th>
                                            <th>Hapus</th>

                                        </tr>
                                    </thead>
                                    {
                                        listAccountType.map((accountType, index) => {
                                            return (
                                                <tbody key={accountType.id}>
                                                    <tr>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                        <td >{accountType.type_name}</td>

                                                        <td >
                                                            <div className="buttonContainer" >
                                                                <Button disabled={accountType.id === "ce25664b-547b-44b6-b5c4-07cb76450321"} variant="primary" onClick={() => {
                                                                    setAccountTypeId(accountType.id)
                                                                }}><PencilFill />
                                                                </Button>
                                                            </div>
                                                        </td>

                                                        <td >
                                                            <div className="buttonContainer" >
                                                                <Button disabled={accountType.id === "ce25664b-547b-44b6-b5c4-07cb76450321"} variant="danger" onClick={() => {
                                                                    if (window.confirm(`Apakah anda ingin menghapus data ${accountType.type_name}`))
                                                                        setRemoveId(accountType.id)
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
                                    setIsSearched={setIsSearched}
                                />



                            </div>


                            <LoadingAnimation
                                isLoading={isLoading}
                            />


                        </div>

                        <Modal show={modalAccountType}
                            // dialogClassName="modal-size"
                            size={"lg"}
                            onHide={() => {
                                setModalAccountType(false);
                                clearTypeAccount();
                            }}>
                            <div className="details m-2" style={{padding:10}} >
                                <div className="detailscontent">
                                    <h3>Jenis Akun </h3>
                                    <hr></hr>
                                </div>

                                <Form onSubmit={(e) => {
                                    e.preventDefault();

                                    setDisabledButton(true);
                                    saveData()
                                }} style={{ padding: 10 }}>

                                    <Form.Group className="mb-3">
                                        {/* <Form.Label>Jenis Akun</Form.Label> */}
                                        <Form.Control onChange={(e) => {
                                            setTypeAccount({ ...typeAccount, type_name: e.target.value })
                                        }} value={typeAccount.type_name} type="text" placeholder="" required></Form.Control>
                                    </Form.Group>



                                    <div style={{ paddingBottom: 10 }}></div>
                                    <div style={{
                                        display: "flex",
                                        flex: 1,
                                        justifyContent: "center"
                                    }}>
                                        <Button style={{ width: 100 }} type="submit" disabled={disabledButton}>Simpan</Button>
                                        <div style={{ paddingRight: 10 }}></div>
                                        <Button style={{ width: 100 }} className="cancel" variant="danger" onClick={() => {
                                            clearTypeAccount();
                                            setModalAccountType(false);
                                        }}>Batal</Button>
                                    </div>


                                </Form>



                            </div>

                        </Modal>

                    </Container>

                </div>



            </div>



        </>
    )
}