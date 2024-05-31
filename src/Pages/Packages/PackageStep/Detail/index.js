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
    isTokenValid, insertUpdatePackage, getPackageById, convertBase64, getPackageStatus, getPackageDocument, getPackageDocumentById,
    deletePackageDocument, insertUpdatePackageDocument, getCountPackageDocument, updatePackageDocumentStatus, getPackageCommand
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

import { triggerBase64Download } from "../../../Helpers/Base64Downloader";
import ContainerBox from "../../../Components/ContainerBox";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PackageStepDetailPage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const [listStatus, setListStatus] = useState([]);
    const navigate = useNavigate();
    const [uploadButton, setUploadButton] = useState(false);
    const [listDocument, setListDocument] = useState([]);
    const location = useLocation();
    const [approveId, setApproveId] = useState("");
    const [statutApproval, setStatusApproval] = useState("");
    const [documentStatus, setDocumentStatus] = useState("");
    const [page, setPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(50);
    const [isOpen, setIsOpen] = useState(false);
    const [uploadFileImageError, setUploadFileImageError] = useState("");
    const [downloadDocumentId, setDownloadDocumentId] = useState("");
    const [packageDocumentId, setPackageDocumentId] = useState("");
    const [removeId, setRemoveId] = useState("");
    const [documentId, setDocumentId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSearched, setIsSearched] = useState(0);
    const [disabledButton, setDisabledButton] = useState(false);
    const [packageId, setPackageId] = useState("");
    const [packages, setPackages] = useState({
        id: 0,
        package_name: "",
        start_date: "",
        end_date: "",
        selection_methode: "",
        package_status: null
    })

    const [command, setCommand] = useState({
        id: 0,
        package_id: location.state.packageId,
        note: "",
        document_id: null
    })

    const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
    const [showDocumentDetailModal, setShowDocumentDetailModal] = useState(false);
    const [showDocumentApprovedModal, setShowDocumentApprovedModal] = useState(false);
    const [zoomFactor, setZoomFactor] = useState(0.5);
    const [newDocument, setNewDocument] = useState({
        id: 0,
        package_id: "",
        url_base64: "",
        document_name: "",
        is_active: true,
        done: false,
    });
    const [documentToBeViewed, setDocumentToBeViewed] = useState({
        id: 0,
        package_id: "",
        url_base64: "",
        document_name: "",
        is_active: true,
    });

    const [documentToBeApproved, setDocumentToBeApproved] = useState({
        id: 0,
        package_id: "",
        url_base64: "",
        document_name: "",
        is_active: true,
    });

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [descending, setDescending] = useState(false);

    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                setPackageId(location.state.packageId)
                loadPackageStatus();
                // loadPackage();
                if (location.state.packageId === 0) {
                    setIsLoading(false);
                }
            }
        }
        checkCookies();
    }, []);

    useEffect(() => {
        console.log(newDocument);
        async function submitNewDocument() {
            if (newDocument.done) {
                await uploadDocument();
            }
        }
        submitNewDocument();
    }, [newDocument]);

    useEffect(() => {
        if (documentToBeViewed.id !== 0)
            setShowDocumentDetailModal(true);
    }, [documentToBeViewed]);

    useEffect(() => {
        if (documentToBeApproved.id !== 0)
            setShowDocumentApprovedModal(true)
    }, [documentToBeApproved])



    useEffect(() => {
        if (packageDocumentId !== "")
            loadDocumentById()
    }, [packageDocumentId])


    useEffect(() => {
        if (packageId !== 0 && packageId !== "") {
            setNewDocument({ ...newDocument, package_id: packageId });
            initDataPackage()
            loadDocumentData();
        }
    }, [packageId])

    useEffect(() => {
        if (listStatus.length > 0) {
            if (packageId === 0) {
                let newList = listStatus.find(p => p.status_code = "new");
                setPackages({ ...packages, package_status: newList.id })
            }
        }
    }, [listStatus]);

    useEffect(() => {
        if (!showDocumentDetailModal) {
            setDocumentToBeViewed({
                id: 0,
                package_id: packageId,
                url_base64: "",
                document_name: "",
                is_active: true,
            });
            setPackageDocumentId("");
        }
    }, [showDocumentDetailModal]);

    useEffect(() => {
        if (!showDocumentApprovedModal) {
            setDocumentToBeApproved({
                id: 0,
                package_id: packageId,
                url_base64: "",
                document_name: "",
                is_active: true,
            });
            setApproveId("");
            setDocumentStatus("");
        }
    }, [showDocumentApprovedModal]);

    useEffect(() => {
        setIsLoading(true);
        if (packageId !== "")
            loadDocumentData();
    }, [page]);

    useEffect(() => {
        if (approveId !== "") {
            loadDocumentApproved();
        }
    }, [approveId])

    useEffect(() => {
        if (isSearched !== 0) {
            setIsLoading(true);
            if (packageId != "")
                loadDocumentData();
        }
    }, [itemPerPage]);

    useEffect(() => {
        setIsLoading(true);
        if (removeId !== "")
            removeDocument();
    }, [removeId]);

    useEffect(() => {
        if (documentId !== "")
            initPackageDocument();
    }, [documentId]);


    useEffect(() => {
        if (downloadDocumentId !== "")
            downloadData();
    }, [downloadDocumentId])




    const initDataPackage = async () => {
        try {
            let response = await getPackageById(cookies.token, packageId);
            console.log(response);
            if (response) {
                setPackages({
                    ...packages,
                    id: response.id,
                    package_name: response.package_name,
                    start_date: response.start_date,
                    package_status: response.package_status,
                    end_date: response.end_date,
                    selection_methode: response.selection_methode
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
                alert('Gagal Menyimpan Data');
                setIsLoading(false);
            }
            setDisabledButton(false)

        } catch (exception) {

        }
    }

    const loadPackageStatus = async () => {
        try {
            let response = await getPackageStatus(cookies.token);
            setListStatus(response)
        } catch (exception) {

        }
    }

    const loadDocumentData = async () => {
        try {
            let documentCount = await getCountPackageDocument(cookies.token, packageId, searchQuery, false);
            let totalPage = documentCount / itemPerPage;
            setTotalPage(totalPage);

            let listDocument = await getPackageDocument(cookies.token, packageId, page, itemPerPage, undefined, descending, searchQuery);
            console.log(listDocument)
            setListDocument(listDocument);
            setIsLoading(false);
            setIsSearched(0)
        } catch (exception) {
            console.log(exception);
        }
    }

    const loadDocumentById = async () => {
        try {
            let response = await getPackageDocumentById(cookies.token, packageDocumentId);
            setDocumentToBeViewed(response);
            setIsLoading(false);
        } catch (exception) {
            console.log(exception)
        }
    }

    const loadDocumentApproved = async () => {
        try {
            if(documentStatus === "Approved"){
                let commandResponse = await getPackageCommand(cookies.token, approveId);
                console.log(commandResponse)
                if(commandResponse){
                    setCommand({
                        ...command,
                        id: commandResponse.id,
                        note: commandResponse.note
                    })
                }
                
            }
            let response = await getPackageDocumentById(cookies.token, approveId);
            setDocumentToBeApproved(response);
            setIsLoading(false);
        } catch (exception) {
            console.log(exception)
        }
    }

    const initPackageDocument = async () => {
        try {
            let response = await getPackageDocumentById(cookies.token, documentId);

            setNewDocument({
                ...newDocument,
                id: response.id,
                document_name: response.document_name
            })
            setShowDocumentUploadModal(true);
            setIsLoading(false);
        } catch (exception) {
            console.log(exception)
        }
    }

    const removeDocument = async () => {
        let response = await deletePackageDocument(cookies.token, removeId);
        if (response === 0) {
            alert(`Data Telah Dihapus`);
            loadDocumentData();
        } else {


        }
        setIsLoading(false);
        setRemoveId('');
    }

    const resetUploadForm = () => {
        let newDocument = {
            id: 0,
            package_id: packageId,
            url_base64: "",
            document_name: "",
            is_active: true,
        };
        setNewDocument(newDocument);
        setDocumentId("");
    }

    const uploadDocument = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(newDocument);
                let res = await insertUpdatePackageDocument(cookies.token, newDocument);
                setShowDocumentUploadModal(false);
                resetUploadForm();
                loadDocumentData();
                resolve();
                setUploadButton(false);
            }
            catch (exception) {
                console.log(exception);
                reject();
            }
        });
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setPageNumber(1);
        setNumPages(numPages);
    }

    const changePage = (offsetPdf) => {
        setPageNumber(prevPageNumber => prevPageNumber + offsetPdf);
    }

    const previousPage = () => {
        changePage(-1);
    }

    const nextPage = () => {
        changePage(1);
    }

    const downloadData = async () => {
        try {
            let response = await getPackageDocumentById(cookies.token, downloadDocumentId);
            triggerBase64Download(response.url_base64, response.document_name);
            setIsLoading(false);
            setDownloadDocumentId("");
        } catch (exception) {
            console.log(exception);
        }
    }

    const ApproveDocument = async()=>{
        try {
                let response = await updatePackageDocumentStatus(cookies.token, command);
                if(response.error_code === 0){
                    alert('Dokumen Telah Disetujui');
                    loadDocumentData();
                    initDataPackage()
                    setShowDocumentApprovedModal(false);
                }else{
                    alert('Gagal Menyetujui Dokumen')
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
                        pageName={"Detail Paket"}
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
                            display: "flex",
                            flexDirection: "column",
                            // borderStyle: "solid",
                            width: "100%",
                            flexWrap: "nowrap"

                        }}>


                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                flexWrap: "nowrap",
                                padding: 10
                            }}>
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    setIsLoading(true);
                                    setDisabledButton(true);
                                    saveData()
                                }}>
                                    <Form.Group  className="mb-3">
                                        <Form.Label>Nama Paket</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} onChange={(e) => {
                                            setPackages({ ...packages, package_name: e.target.value })
                                        }} value={packages.package_name} required></Form.Control>
                                    </Form.Group>
                                  
                                    <Form.Group className="mb-3">
                                        <Form.Label>Metode Pemilihan</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="Text" onChange={(e) => {
                                            setPackages({ ...packages, selection_methode: e.target.value })
                                        }} value={packages.selection_methode} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Pagu</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="Text" onChange={(e) => {
                                            // setPackages({ ...packages, selection_methode: e.target.value })
                                        }} value={"Rp 15.897.723.162"} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>HPS</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="Text" onChange={(e) => {
                                            // setPackages({ ...packages, selection_methode: e.target.value })
                                        }} value={"Rp 15.800.000.000"} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Kontrak</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="Text" onChange={(e) => {
                                            // setPackages({ ...packages, selection_methode: e.target.value })
                                        }} value={"Rp 13.815.090.897"} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nama PPK</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="Text" onChange={(e) => {
                                            // setPackages({ ...packages, selection_methode: e.target.value })
                                        }} value={"Dewi Aryati Ningrum"} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nama Penyedia</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="Text" onChange={(e) => {
                                            // setPackages({ ...packages, selection_methode: e.target.value })
                                        }} value={"PT. Satyagi Cipta Prima"} required></Form.Control>
                                    </Form.Group>
                                    
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>Status Paket</Form.Label>
                                        <Form.Select disabled value={packages.package_status}>
                                            <option></option>

                                            {listStatus.map((status, index) => {
                                                return (
                                                    <option value={status.id} key={index}>{status.status_name}</option>
                                                )
                                            })}

                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tanggal Mulai</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="date" onChange={(e) => {
                                            setPackages({ ...packages, start_date: e.target.value })
                                        }} value={!packages.start_date ? moment(packages.start_date).format("yyyy-MM-DD") : ""} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tanggal Selesai</Form.Label>
                                        <Form.Control disabled={cookies.userRole !== 2} type="date" onChange={(e) => {
                                            setPackages({ ...packages, end_date: e.target.value })
                                        }} value={!packages.end_date ? moment(packages.end_date).format("yyyy-MM-DD") : ""} required></Form.Control>
                                    </Form.Group>

                                    {
                                        packageId !== 0 && packageId !== "" &&
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}>
                                            <div style={{ paddingBottom: 20 }}></div>
                                            <div hidden={cookies.userRole !== 2} style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                width: "100%",
                                                paddingRight: 30
                                            }}>
                                                <Button hidden={listDocument.length>0} variant="primary" style={{
                                                    width: "10%"
                                                }} onClick={() => {
                                                    setShowDocumentUploadModal(true);
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
                                            <div style={{paddingBottom:10}}></div>
                                            <Table striped bordered hover>
                                                <thead >
                                                    <tr>
                                                        <th style={{ textAlign: "center" }}>Nama Dokumen</th>
                                                        <th style={{ textAlign: "center" }}>Status Dokumen</th>
                                                        <th style={{ width: 120, textAlign: "center" }} hidden={cookies.userRole !== 2}>Edit</th>
                                                        <th style={{ width: 130, textAlign: "center" }}>Lihat Dokumen</th>
                                                        <th style={{ width: 120, textAlign: "center" }} hidden={cookies.userRole !== 1}>Setujui</th>
                                                        <th style={{ width: 120, textAlign: "center" }} hidden={cookies.userRole !== 2}>Hapus</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        listDocument.map((docs, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{docs.document_name}</td>
                                                                    <td>{docs.document_status_name}</td>
                                                                    <td hidden={cookies.userRole !== 2} style={{ textAlign: "center" }}><Button disabled={docs.document_status_name === "Approved"} style={{ width: 50 }} onClick={() => {
                                                                        setDocumentId(docs.id)
                                                                    }}><PencilFill /></Button></td>
                                                                    <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                        setPackageDocumentId(docs.id)
                                                                    }}><EyeFill /></Button></td>
                                                                    <td style={{ textAlign: "center" }} hidden={cookies.userRole !== 1}><Button style={{ width: 50 }} onClick={() => {
                                                                        setApproveId(docs.id);
                                                                        setCommand({...command,id: docs.id});
                                                                        setDocumentStatus(docs.document_status_name)
                                                                        // if(docs.document_status_name === "Apporved"){
                                                                        //     setDocumentStatus("Approved")
                                                                        // }
                                                                    }}><CheckLg /></Button></td>
                                                                    <td hidden={cookies.userRole !== 2} style={{ textAlign: "center" }}><Button disabled={docs.document_status_name === "Approved"} variant="danger" style={{ width: 50 }} onClick={() => {
                                                                        if (window.confirm("Apakah Anda Yakin Menghapus Data Ini ")) {
                                                                            setRemoveId(docs.id)
                                                                        }
                                                                    }}><Trash /></Button></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>

                                            </Table>
                                        </div>

                                    }

                                    <div hidden={cookies.userRole !== 2} style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        padding: 10,
                                        justifyContent: "center"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            paddingRight: 5
                                        }}>
                                            <Button disabled={disabledButton} style={{ width: 100 }} type="submit">Simpan</Button>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            paddingLeft: 5
                                        }}>
                                            <Button style={{ width: 100 }} type="reset" variant="danger" onClick={(e) => {
                                                navigate('/Package')
                                            }}>Batal</Button>
                                        </div>


                                    </div>

                                </Form>
                            </div>




                            <LoadingAnimation
                                isLoading={isLoading}
                            />


                        </div >

                        <Modal show={showDocumentUploadModal}
                            // dialogClassName="modal-size"
                            size={"lg"}
                            onHide={() => {
                                resetUploadForm();
                                setShowDocumentUploadModal(false);
                            }}>
                            <div className="details m-2" >
                                <div className="detailscontent">
                                    <h3>Dokumen {packages.package_name} </h3>
                                </div>

                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    setNewDocument({ ...newDocument, done: true });
                                    setUploadButton(true);
                                    setIsLoading(true);
                                }} style={{ padding: 10 }}>



                                    <Form.Group className="mb-3">
                                        <Form.Label>Dokumen</Form.Label>
                                        <Form.Control onChange={async (e) => {
                                            if (e.target.files[0].type === "application/pdf") {
                                                let base64Doc = await convertBase64(e.target.files[0]);
                                                setNewDocument({ ...newDocument, url_base64: base64Doc.toString(), file: e.target.value });
                                                setUploadFileImageError("");
                                                setUploadButton(false)

                                            } else {
                                                setNewDocument({ ...newDocument, url_base64: "", file: "" });
                                                setUploadFileImageError(`Hanya Bisa File PDF`)
                                                setUploadButton(true)
                                            }

                                        }} type="file" required={newDocument.id === 0}></Form.Control>

                                    </Form.Group>
                                    {
                                        uploadFileImageError && <p style={{ color: "red" }}>{uploadFileImageError}</p>
                                    }

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nama Dokumen</Form.Label>

                                        <Form.Control onChange={(e) => {
                                            setNewDocument({ ...newDocument, document_name: e.target.value })
                                        }} value={newDocument.document_name} type="text" placeholder="" required></Form.Control>

                                    </Form.Group>



                                    <div style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "center",
                                        flex: 1,
                                    }}>
                                        <Button style={{ width: 100 }} variant="primary" type="submit" disabled={uploadButton}>
                                            Simpan
                                        </Button>
                                        <div style={{ paddingRight: 10 }}></div>
                                        <Button style={{ width: 100 }} className="cancel" variant="danger" onClick={() => {
                                            resetUploadForm();
                                            loadDocumentData();
                                            setShowDocumentUploadModal(false);
                                        }}>
                                            Batal
                                        </Button>
                                    </div>
                                </Form>



                            </div>

                        </Modal>

                        <Modal size="xl" show={showDocumentDetailModal} onHide={() => {
                            setShowDocumentDetailModal(false);
                        }}>
                            <ContainerBox containerPos="inner" titleCaption={documentToBeViewed.document_name}
                                useActionContainer={true}
                                actionContainerChild={
                                    <div>
                                        <Button style={{

                                        }} onClick={() => {
                                            setShowDocumentDetailModal(false);
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
                                                }}><XSquareFill size={32} /></div>
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
                                                }}>Tutup</div>
                                            </div>
                                        </Button>
                                    </div>
                                }
                                childContent={
                                    <div style={{
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "column"
                                    }}>
                                        <div>
                                            <Document
                                                file={documentToBeViewed.url_base64}
                                                onLoadSuccess={onDocumentLoadSuccess}
                                                loading={() => {

                                                }}
                                            ><div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                            }}>
                                                    <div style={{
                                                        display: "flex",
                                                        flex: 1,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignContent: "center",
                                                        overflow: "scroll",
                                                    }}>
                                                        <Page scale={zoomFactor} pageNumber={pageNumber} />
                                                        {(pageNumber + 1) < numPages &&
                                                            <Page scale={zoomFactor} pageNumber={pageNumber + 1} />
                                                        }

                                                    </div>
                                                </div>
                                            </Document>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            flex: 1,
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignContent: "center",
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                            }}>
                                                <p>
                                                    Halaman {pageNumber} Dari {numPages}
                                                </p>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                flexWrap: "wrap",
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5,
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={zoomFactor <= 0.2}
                                                        onClick={() => {
                                                            setZoomFactor(zoomFactor * 0.75);
                                                        }}
                                                    >

                                                        <ZoomOut size={28} />
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={false}
                                                        onClick={() => {
                                                            setZoomFactor(0.5);
                                                        }}
                                                    >
                                                        <AspectRatioFill size={28} />
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5,
                                                    flexWrap: "wrap",
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={zoomFactor >= 10}
                                                        onClick={() => {
                                                            setZoomFactor(zoomFactor * 1.25);
                                                        }}
                                                    >
                                                        <ZoomIn size={28} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                padding: 5
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={pageNumber <= 1}
                                                        onClick={previousPage}
                                                    >

                                                        <ChevronDoubleLeft size={28} />
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={pageNumber >= numPages}
                                                        onClick={nextPage}
                                                    >
                                                        <ChevronDoubleRight size={28} />
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                } />

                        </Modal>

                        <Modal size="xl" show={showDocumentApprovedModal} onHide={() => {
                            setShowDocumentApprovedModal(false);
                        }}>
                            <ContainerBox containerPos="inner" titleCaption={documentToBeApproved.document_name}
                                useActionContainer={true}
                                actionContainerChild={
                                    <div>
                                        <Button style={{

                                        }} onClick={() => {
                                            setShowDocumentApprovedModal(false);
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
                                                }}><XSquareFill size={32} /></div>
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
                                                }}>Tutup</div>
                                            </div>
                                        </Button>
                                    </div>
                                }
                                childContent={
                                    <div style={{
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "column"
                                    }}>
                                        <div>
                                            <Document
                                                file={documentToBeApproved.url_base64}
                                                onLoadSuccess={onDocumentLoadSuccess}
                                                loading={() => {

                                                }}
                                            ><div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                            }}>
                                                    <div style={{
                                                        display: "flex",
                                                        flex: 1,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignContent: "center",
                                                        overflow: "scroll",
                                                        maxHeight: 600
                                                    }}>
                                                        <Page scale={zoomFactor} pageNumber={pageNumber} />
                                                        {(pageNumber + 1) < numPages &&
                                                            <Page scale={zoomFactor} pageNumber={pageNumber + 1} />
                                                        }

                                                    </div>
                                                </div>
                                            </Document>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            flex: 1,
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignContent: "center",
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                            }}>
                                                <p>
                                                    Halaman {pageNumber} Dari {numPages}
                                                </p>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                flexWrap: "wrap",
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5,
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={zoomFactor <= 0.2}
                                                        onClick={() => {
                                                            setZoomFactor(zoomFactor * 0.75);
                                                        }}
                                                    >

                                                        <ZoomOut size={28} />
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={false}
                                                        onClick={() => {
                                                            setZoomFactor(0.5);
                                                        }}
                                                    >
                                                        <AspectRatioFill size={28} />
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5,
                                                    flexWrap: "wrap",
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={zoomFactor >= 10}
                                                        onClick={() => {
                                                            setZoomFactor(zoomFactor * 1.25);
                                                        }}
                                                    >
                                                        <ZoomIn size={28} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                padding: 5
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={pageNumber <= 1}
                                                        onClick={previousPage}
                                                    >

                                                        <ChevronDoubleLeft size={28} />
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    padding: 5
                                                }}>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        disabled={pageNumber >= numPages}
                                                        onClick={nextPage}
                                                    >
                                                        <ChevronDoubleRight size={28} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                padding: 10,
                                                flexDirection: "column"
                                            }}>
                                                <Form onSubmit={(e)=>{
                                                    e.preventDefault();
                                                    ApproveDocument();

                                                }}>  
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Catatan</Form.Label>
                                                        <Form.Control onChange={(e)=>{
                                                            setCommand({...command, note: e.target.value})
                                                        }} value={command.note} as={"textarea"} rows={3} required></Form.Control>
                                                    </Form.Group>

                                                    <Button hidden={documentStatus === "Approved"} type="submit">Setujui</Button>
                                                </Form>

                                            </div>

                                        </div>
                                    </div>
                                } />

                        </Modal>

                    </Container >
                </div>
            </div >

        </>
    )
}