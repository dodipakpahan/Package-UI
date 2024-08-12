import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Table, Modal, Tab, Tabs } from "react-bootstrap";
import {
    Search, BoxSeam, PencilFill, Trash, Download, FileWord, FileEarmarkText, ChevronDoubleLeft, ChevronDoubleRight,
    FilePlusFill, ArrowClockwise, GearWideConnected, EyeFill, Eye, InfoCircleFill, ZoomIn, ZoomOut, AspectRatioFill,
    XSquareFill,
    CheckLg,
    ArrowLeft,
    FilePdf
} from "react-bootstrap-icons";
import "../../../../App.css"
import { Container } from "react-bootstrap";
import {
    isTokenValid, getPackageStepById, getPackageStep, getDetailPackage, convertBase64,
    insertUpdatePackageStep12,
    getPackageStep12ById,
    getPackageStep12Document,
    updateStep12DocumentStatus,
    updateStep1DocumentStatus,
    deleteDocumentStep12
} from "../../../../Helpers/ApplicationHelper";
import Sidebar from "../../../../Components/Sidebar";
import backLogo from "../../../../Assets/images/leftArrow.png"
import DetaiPackage from "../../../../Components/DetailPackage";
import LoadingAnimation from "../../../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from "../../../../Components/Navbar";
import Select from "react-select";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import webLogo from "../../../../Assets/images/log-silikon-removebg-preview.png"
import Paginations from "../../../../Components/Pagination";

import { triggerBase64Download } from "../../../../Helpers/Base64Downloader";
import ContainerBox from "../../../../Components/ContainerBox";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PackageStep12Page() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [stepId, setStepId] = useState("");
    const [listDocument, setListDocument] = useState([]);
    const [listDailyReport, setListDailyReport] = useState([]);
    const [modalDocumentTab2, setModalDocumentTab2] = useState("");
    const [modalDocumentTab3, setModalDocumentTab3] = useState("");
    const [listMonthlyReport, setListMonthlyReport] = useState([]);
    const [listWeeklyReport, setWeeklyReport] = useState([]);
    const [listShopDrawing, setListShopDrawing] = useState([]);
    const [listLateNotice, setListLateNotice] = useState([]);
    const [listSCMDocument, setListSCMDocument] = useState([]);
    const [listWarningLetter, setListWarningLetter] = useState([]);
    const [listApprovalMaterial, setListApprovalMaterial] = useState([]);
    const [listSearchedDailyReport, setListSearchedDailyReport] = useState([]);
    const [stepNumber, setStepNumber] = useState(0);
    const [packageId, setPackageId] = useState("");
    const [listStep, setListStep] = useState([]);
    const [searchButton, setSearchButton] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [detailStep, setDetailStep] = useState({});
    const [removeId, setRemoveId] = useState("");
    const [dailyDate, setDailyDate] = useState("");
    const [detailPackage, setDetailPackage] = useState({});
    const [uploadButton, setUploadButton] = useState(false);
    const [uploadFileImageError, setUploadFileImageError] = useState("");
    const [downloadDocumentId, setDownloadDocumentId] = useState("");
    const [documentId, setDocumentId] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [stepDocumentId, setStepDocumentId] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
    const [showDocumentDetailModal, setShowDocumentDetailModal] = useState(false);
    const [zoomFactor, setZoomFactor] = useState(0.5);
    const [page, setPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [isSearched, setIsSearched] = useState(0);
    const [baApproval, setBaApproval] = useState("");

    const [showDocumentApprovedModal, setShowDocumentApprovedModal] = useState(false);
    const [documentStatus, setDocumentStatus] = useState("");
    const [approveId, setApproveId] = useState("");

    const [documentToBeApproved, setDocumentToBeApproved] = useState({
        id: 0,
        package_step_id: "",
        url_base64: "",
        document_name: "",
        description: "",
        is_active: true,
    });


    const [newDocument, setNewDocument] = useState({
        id: 0,
        package_step_id: "",
        url_base64: "",
        document_name: "",
        description: "",
        document_number: "",
        start_date: null,
        end_date: null,
        document_type: null,
        is_active: true,
        done: false,
    });
    const [documentToBeViewed, setDocumentToBeViewed] = useState({
        id: 0,
        package_step_id: "",
        url_base64: "",
        document_name: "",
        description: "",
        is_active: true,
    });




    useEffect(() => {
        async function checkCookies() {
            let isAuthenticated = await isTokenValid(cookies.token);
            if (!isAuthenticated)
                navigate("/");
            else {
                setStepId(location.state.stepId);
                setPackageId(location.state.packageId);
                // loadPackage();
                if (location.state.stepId === 0) {
                    setIsLoading(false);
                }
            }
        }
        checkCookies();
    }, [location.state]);

    useEffect(() => {
        if (newDocument.id !== 0){
            setShowDocumentUploadModal(true);
        }
          
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
        if (stepId !== "" && stepId !== null) {
            initPackageStep();
            setNewDocument({ ...newDocument, package_step_id: stepId });
            loadDocumentData();
        }
    }, [stepId]);

    useEffect(() => {
        if (packageId !== "" && packageId !== null) {
            initPackage();
            loadPackageStep();
        }
    }, [packageId])

    useEffect(() => {
        if (stepDocumentId !== "")
            loadDocumentById()
    }, [stepDocumentId]);

    useEffect(()=>{
        if(removeId !== "")
            removeDocument();
    },[removeId])

    useEffect(() => {
        if (!showDocumentDetailModal) {
            setDocumentToBeViewed({
                id: 0,
                package_step_id: stepId,
                url_base64: "",
                document_name: "",
                is_active: true,
            });
            setStepDocumentId("");
        }
    }, [showDocumentDetailModal]);


    useEffect(() => {
        // loadReturn();
        setListSearchedDailyReport(listDailyReport.slice(page * itemPerPage, itemPerPage * (page + 1)));
    }, [page]);

    useEffect(() => {
        // loadReturn();
        if (isSearched === 1) {
            setListSearchedDailyReport(listDailyReport.slice(page * itemPerPage, itemPerPage * (page + 1)));
            setIsSearched(0);
        }

    }, [itemPerPage]);

    useEffect(() => {
        setListSearchedDailyReport(listDailyReport.slice(page * itemPerPage, itemPerPage * (page + 1)));
        if (listDailyReport.length > 0) {
            let totalPage = listDailyReport.length / itemPerPage;
            setTotalPage(totalPage);
        }
    }, [listDailyReport]);

    useEffect(() => {
        if (dailyDate === "") {
            let totalPage = listDailyReport.length / itemPerPage;
            setTotalPage(totalPage);
            setListSearchedDailyReport(listDailyReport.slice(page * itemPerPage, itemPerPage * (page + 1)));
        }
    }, [dailyDate]);

    useEffect(() => {
        if (downloadDocumentId !== "")
            downloadData();
    }, [downloadDocumentId])

    useEffect(() => {
        if (searchButton === 1) {
            if (dailyDate !== "") {
                let listSearch = listDailyReport.filter(p => moment(p.start_date).format("yyyy-MM-DD") === moment(dailyDate).format("yyyy-MM-DD"));
                if (listSearch) {
                    setListSearchedDailyReport(listSearch);
                    let totalPage = listSearch.length / itemPerPage;
                    setTotalPage(totalPage);
                }

                else {
                    setTotalPage(0);
                    setListSearchedDailyReport([]);
                }

            } else {
                setListSearchedDailyReport(listDailyReport);
            }
            setSearchButton(0);
            setIsSearched(0);
        }

    }, [searchButton]);

    useEffect(() => {
        if (!showDocumentApprovedModal) {
            setDocumentToBeApproved({
                id: 0,
                package_step_id: stepId,
                url_base64: "",
                document_name: "",
                is_active: true,
            });
            setApproveId("");
            setDocumentStatus("");
        }
    }, [showDocumentApprovedModal]);

    useEffect(() => {
        if (approveId !== "") {
            loadDocumentApproved()
        }
    }, [approveId])

    useEffect(() => {
        if (documentToBeApproved.id !== 0)
            setShowDocumentApprovedModal(true)
    }, [documentToBeApproved])




    const initPackageStep = async () => {
        try {
            let response = await getPackageStepById(cookies.token, location.state.stepId);
            if (response) {
                setDetailStep(response);
                setStepNumber(response.package_step)
            }
            setIsLoading(false);

        } catch (exception) {

        }
    }

    const loadPackageStep = async () => {
        try {

            let response = await getPackageStep(cookies.token, location.state.packageId);
            setListStep(response)

        } catch (exception) {
            console.log(exception)
        }
    }


    const handleDownload = () => {
        // Create a link element
        const link = document.createElement('a');

        // Set the href attribute to the path of the file in the public directory
        link.href = `${process.env.PUBLIC_URL}/docs/format_pelaksanaan_pekerjaan.pdf`;

        // Set the download attribute with the filename
        link.download = 'format_pelaksanaan_pekerjaan.pdf';

        // Programmatically click the link to trigger the download
        link.click();
    };

    const handleDownloadBA = () => {
        // Create a link element
        const link = document.createElement('a');

        // Set the href attribute to the path of the file in the public directory
        link.href = `${process.env.PUBLIC_URL}/docs/berita_acara_scm.docx`;

        // Set the download attribute with the filename
        link.download = 'berita_acara_scm.docx';

        // Programmatically click the link to trigger the download
        link.click();
    };

    const handleDownloadUndangan = () => {
        // Create a link element
        const link = document.createElement('a');

        // Set the href attribute to the path of the file in the public directory
        link.href = `${process.env.PUBLIC_URL}/docs/undangan_rapat_scm.docx`;

        // Set the download attribute with the filename
        link.download = 'undangan_rapat_scm.docx';

        // Programmatically click the link to trigger the download
        link.click();
    };

    const initPackage = async () => {
        try {
            let response = await getDetailPackage(cookies.token, location.state.packageId);
            console.log(response);
            if (response) {
                setDetailPackage(response);
            }
        } catch (exception) {

        }
    }

    const uploadDocument = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await insertUpdatePackageStep12(cookies.token, newDocument, packageId, window.location.pathname);
                alert('Data Telah Disimpan');
                setShowDocumentUploadModal(false);
                setModalDocumentTab2(false);
                setModalDocumentTab3(false);
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

    const resetUploadForm = () => {
        let newDocument = {
            id: 0,
            package_step_id: stepId,
            url_base64: "",
            description: "",
            document_name: "",
            start_date: null,
            end_date: null,
            document_type: null,
            is_active: true,
            document_number: ""
        };
        setNewDocument(newDocument);
        setDocumentId("");
    }

    const downloadData = async () => {
        try {
            let response = await getPackageStep12ById(cookies.token, downloadDocumentId);
            triggerBase64Download(response.url_base64, response.document_name ? response.document_name : response.document_number);
            setIsLoading(false);
            setDownloadDocumentId("");
        } catch (exception) {
            console.log(exception);
        }
    }



    const loadDocumentData = async () => {
        try {

            let listDocument = await getPackageStep12Document(cookies.token, stepId);
            let listDaily = listDocument.filter(p => p.document_type === "0");
            let weekly = listDocument.filter(p => p.document_type === "1");
            let monthly = listDocument.filter(p => p.document_type === "2");
            let drawings = listDocument.filter(p => p.document_type === "3");
            let material = listDocument.filter(p => p.document_type === "4");
            let lately = listDocument.filter(p => p.document_type === "5");
            let warnings = listDocument.filter(p => p.document_type === "8");
            let tab3 = listDocument.filter(p => p.document_type === "6" | p.document_type === "7");
            setListDailyReport(listDaily);
            setListSearchedDailyReport(listDaily);
            setListShopDrawing(drawings);
            setWeeklyReport(weekly);
            setListMonthlyReport(monthly);
            setListApprovalMaterial(material);
            setListLateNotice(lately);
            setListSCMDocument(tab3);
            setListWarningLetter(warnings);
            setIsLoading(false);
            setIsSearched(0);
        } catch (exception) {
            console.log(exception);
        }
    }



    const loadDocumentById = async () => {
        try {
            let response = await getPackageStep12ById(cookies.token, stepDocumentId);
            setDocumentToBeViewed(response);
            setIsLoading(false);
        } catch (exception) {
            console.log(exception)
        }
    }

    const formatCurrency = (value) => {
        // If value is empty or null, return "0"

        if (!value || value.trim() === "") {
            console.log('tes')
            return "0";

        } else {
            console.log('tes2')
            value = value.replace(/\D/g, '');

            // Format the value as currency
            if (value.trim() === "") {
                return "0";
            }
            const formattedValue = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(parseFloat(value));

            return formattedValue;

        }
        // Remove non-digit characters


    };

    const loadDocumentApproved = async () => {
        try {
            let response = await getPackageStep12ById(cookies.token, approveId);
            setDocumentToBeApproved(response);
            setIsLoading(false);
        } catch (exception) {
            console.log(exception)
        }
    }

    const ApproveDocument = async (documentId, approval) => {
        try {
            let stepPayload = {}
            stepPayload.id = documentId;
            stepPayload.package_id = packageId;
            stepPayload.package_step_id = stepId;
            stepPayload.path = window.location.pathname;
            stepPayload.provider_name = detailPackage.provider_name;
            stepPayload.document_type = documentToBeApproved.document_type;
            stepPayload.approvals = approval === 0? false : true;
            let response = await updateStep12DocumentStatus(cookies.token, stepPayload);
            if (response.error_code === 0) {
                alert(baApproval === 1 ?'Dokumen Telah Disetujui' :"Dokumen Telah Ditolak");
                loadDocumentData();
            } else {
                alert(baApproval === 1 ?'Gagal Menyetujui Dokumen' :'Gagal Tolak Dokumen')
            }
            setShowDocumentApprovedModal(false);
        } catch (exception) {

        }
    }

    const removeDocument = async()=>{
        try {
            let response = await deleteDocumentStep12(cookies.token, removeId);
            if(response === 0){
                alert('Laporan Telah Dihapus');
                loadDocumentData();
            }else{
                alert('Gagal Menghapus Laporan');
            }
            setRemoveId("");
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
                        pageName={"Detail Tahapan"}
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
                                flexDirection: "column",
                                flexWrap: "nowrap",
                                padding: 10
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "nowrap",
                                    borderBottomStyle: "inset"
                                }}>
                                    <div onClick={() => {
                                        navigate("/Package/Step", { state: { packageId: location.state.packageId } })
                                    }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><img src={backLogo} alt="Icon" style={{ width: '50px', height: '50px' }} /></div>
                                    <div style={{ paddingRight: 10 }}></div>
                                    <div style={{ display: "flex", alignItems: "center", fontSize: 35 }}>{detailStep.step_name}</div>
                                </div>

                                <div style={{ paddingBottom: 30 }}></div>


                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "nowrap",
                                    width: "100%",
                                    padding: 10
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 4,
                                        // borderStyle: "solid",
                                        height: 400,
                                        // paddingRight: 10
                                    }}>
                                        <DetaiPackage
                                            packageDetail={detailPackage}
                                        />
                                    </div>



                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 9,
                                        // borderStyle: "solid",
                                        minHeight: 200,
                                        paddingLeft: 10
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            flex: 4,
                                            borderStyle: "inset",
                                            height: 300,
                                            // paddingRight: 10
                                        }}>
                                            <div style={{
                                                alignItems: "center",
                                                backgroundColor: "#498dd9",
                                                // borderStyle:"solid"
                                                color: "#fff",
                                                fontWeight: "bold",
                                                // borderStyle:"solid"
                                                borderBottomStyle: "solid",
                                                borderColor: "gray"
                                            }}>
                                                <div style={{ paddingLeft: 10, alignItems: "center", display: "flex", fontSize: 25 }}>
                                                    <div>Unduh dan Unggah Dokumen</div>
                                                </div>

                                            </div>
                                            <div style={{
                                                paddingBottom: 10
                                            }}></div>

                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                padding: 10
                                            }}>
                                                <Tabs
                                                    defaultActiveKey="tabLaporan"
                                                    // transition={false}
                                                    id="noanim-tab-example"
                                                    // className="mb-3"
                                                    style={{
                                                        // backgroundColor: "rgba(3, 30, 103, 1)",
                                                        borderRadius: 5,

                                                    }}
                                                >
                                                    <Tab eventKey="tabLaporan" title={`Laporan`}>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            padding: 5
                                                        }}>
                                                            {
                                                                cookies.userRole === 4 &&
                                                                <div style={{
                                                                    marginLeft: 100
                                                                }}>
                                                                    <div>Unduh Format Laporan</div>
                                                                    <Button style={{
                                                                        width: 150,
                                                                        height: 40
                                                                    }} onClick={() => {
                                                                        handleDownload()
                                                                    }}><div style={{ display: "flex", fontSize: 11, alignItems: "center" }}><FilePdf size={20} /> Unduh Format Laporan</div> </Button>






                                                                </div>
                                                            }


                                                            <div style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                justifyContent: "flex-start",
                                                                alignItems: "center",
                                                            }}>
                                                                <div style={{ paddingBottom: 20 }}></div>
                                                                <div hidden={cookies.userRole !== 4} style={{
                                                                    display: "flex",
                                                                    justifyContent: "flex-end",
                                                                    width: "80%",
                                                                    paddingRight: 30
                                                                }}>
                                                                    <Button variant="primary" style={{
                                                                        width: 130
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
                                                                                fontSize: 14,
                                                                            }}>Tambah Data</div>
                                                                        </div>
                                                                    </Button>
                                                                </div>
                                                                <div style={{ paddingBottom: 10 }}></div>
                                                                <h4>Laporan Harian</h4>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    flexDirection: "row",
                                                                    width: "50%"
                                                                }}>
                                                                    <div style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        flex: 5,
                                                                        paddingRight: 5
                                                                    }}><Form.Control type="date" value={dailyDate} onChange={(e) => {
                                                                        setDailyDate(e.target.value)
                                                                    }}></Form.Control></div>
                                                                    <div style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        // flex:1,
                                                                        paddingLeft: 5,
                                                                        paddingRight: 5
                                                                    }}> <Button onClick={() => {
                                                                        setPage(0);
                                                                        setSearchButton(1);
                                                                    }} style={{ width: 50 }}><Search size={22} /></Button></div>
                                                                    <div style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        // flex:1,
                                                                        // paddingLeft:5,
                                                                    }}>  <Button onClick={() => {
                                                                        setPage(0);
                                                                        setDailyDate("");
                                                                        // let totalPage = listDailyReport.length / itemPerPage;
                                                                        // setTotalPage(totalPage);
                                                                        // setListSearchedDailyReport(listDailyReport);
                                                                    }} style={{ width: 50 }}><ArrowClockwise /></Button></div>



                                                                </div>
                                                                <div style={{ paddingBottom: 10 }}></div>
                                                                <Table className="packageTableDetail" style={{ width: '80%', borderCollapse: 'collapse' }}>
                                                                    <thead >
                                                                        <tr>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>No</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nama Dokumen</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Edit</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Hapus</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listSearchedDailyReport.map((docs, index) => {
                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td style={{ textAlign: "center" }} >{(page * itemPerPage) + (index + 1)}</td>
                                                                                        <td>{docs.document_name}</td>
                                                                                        <td>{docs.start_date ? moment(docs.start_date).format("DD-MM-yyyy") : ""}</td>
                                                                                        <td hidden={cookies.userRole !== 4} style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setNewDocument(docs)
                                                                                        }}><PencilFill /></Button></td>
                                                                                        <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setStepDocumentId(docs.id)
                                                                                        }}><EyeFill /></Button></td>
                                                                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setDownloadDocumentId(docs.id)
                                                                                        }}><Download /></Button></td>
                                                                                         <td hidden={cookies.userRole !== 4} style={{ textAlign: "center", verticalAlign: "middle" }}><Button variant="danger" style={{ width: 50 }} onClick={() => {
                                                                                            if(window.confirm(`Apakah Anda Ingin Menghapus Data Ini?`)){
                                                                                                setRemoveId(docs.id)
                                                                                            }

                                                                                        }}><Trash /></Button></td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                    <div style={{
                                                                        paddingTop: 20,
                                                                    }}>

                                                                    </div>








                                                                </Table>
                                                                <Paginations
                                                                    itemPerPage={itemPerPage}
                                                                    totalPage={totalPage}
                                                                    page={page}
                                                                    setPage={setPage}
                                                                    // setItemPerPage={setItemPerPage}
                                                                    setIsSearched={setIsSearched}
                                                                />
                                                                <div style={{ paddingBottom: 30 }}></div>
                                                                <h4>Laporan Mingguan</h4>
                                                                <Table className="packageTableDetail" style={{ width: '80%', borderCollapse: 'collapse' }}>
                                                                    <thead >
                                                                        <tr>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>No</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nama Dokumen</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal Mulai</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal Selesai</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Edit</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Hapus</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listWeeklyReport.map((docs, index) => {
                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                                        <td>{docs.document_name}</td>
                                                                                        <td>{docs.start_date ? moment(docs.start_date).format("DD-MM-yyyy") : ""}</td>
                                                                                        <td>{docs.end_date ? moment(docs.end_date).format("DD-MM-yyyy") : ""}</td>
                                                                                        <td hidden={cookies.userRole !== 4} style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setNewDocument(docs)
                                                                                        }}><PencilFill /></Button></td>
                                                                                        <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setStepDocumentId(docs.id)
                                                                                        }}><EyeFill /></Button></td>
                                                                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setDownloadDocumentId(docs.id)
                                                                                        }}><Download /></Button></td>
                                                                                          <td hidden={cookies.userRole !== 4} style={{ textAlign: "center", verticalAlign: "middle" }}><Button variant="danger" style={{ width: 50 }} onClick={() => {
                                                                                            if(window.confirm(`Apakah Anda Ingin Menghapus Data Ini?`)){
                                                                                                setRemoveId(docs.id)
                                                                                            }

                                                                                        }}><Trash /></Button></td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>

                                                                </Table>

                                                                <div style={{ paddingBottom: 30 }}></div>
                                                                <h4>Laporan Bulanan</h4>
                                                                <Table className="packageTableDetail" style={{ width: '80%', borderCollapse: 'collapse' }}>
                                                                    <thead >
                                                                        <tr>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>No</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nama Dokumen</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal Mulai</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal Selesai</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Edit</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Hapus</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listMonthlyReport.map((docs, index) => {
                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                                        <td>{docs.document_name}</td>
                                                                                        <td>{docs.start_date ? moment(docs.start_date).format("DD-MM-yyyy") : ""}</td>
                                                                                        <td>{docs.end_date ? moment(docs.end_date).format("DD-MM-yyyy") : ""}</td>
                                                                                        <td hidden={cookies.userRole !== 4} style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setNewDocument(docs)
                                                                                        }}><PencilFill /></Button></td>
                                                                                        <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setStepDocumentId(docs.id)
                                                                                        }}><EyeFill /></Button></td>
                                                                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setDownloadDocumentId(docs.id)
                                                                                        }}><Download /></Button></td>
                                                                                          <td hidden={cookies.userRole !== 4} style={{ textAlign: "center", verticalAlign: "middle" }}><Button variant="danger" style={{ width: 50 }} onClick={() => {
                                                                                            if(window.confirm(`Apakah Anda Ingin Menghapus Data Ini?`)){
                                                                                                setRemoveId(docs.id)
                                                                                            }

                                                                                        }}><Trash /></Button></td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>

                                                                </Table>

                                                                <div style={{ paddingBottom: 30 }}></div>
                                                                <h4>Gambar Kerja</h4>
                                                                <Table className="packageTableDetail" style={{ width: '80%', borderCollapse: 'collapse' }}>
                                                                    <thead >
                                                                        <tr>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle', width: 50 }}>No</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nama Dokumen</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Edit</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Hapus</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listShopDrawing.map((docs, index) => {
                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                                        <td>{docs.document_name}</td>
                                                                                        <td hidden={cookies.userRole !== 4} style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setNewDocument(docs)
                                                                                        }}><PencilFill /></Button></td>
                                                                                        <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setStepDocumentId(docs.id)
                                                                                        }}><EyeFill /></Button></td>
                                                                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setDownloadDocumentId(docs.id)
                                                                                        }}><Download /></Button></td>
                                                                                          <td hidden={cookies.userRole !== 4} style={{ textAlign: "center", verticalAlign: "middle" }}><Button variant="danger" style={{ width: 50 }} onClick={() => {
                                                                                            if(window.confirm(`Apakah Anda Ingin Menghapus Data Ini?`)){
                                                                                                setRemoveId(docs.id)
                                                                                            }

                                                                                        }}><Trash /></Button></td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>

                                                                </Table>

                                                                <div style={{ paddingBottom: 30 }}></div>
                                                                <h4>Pengajuan Material</h4>
                                                                <Table className="packageTableDetail" style={{ width: '80%', borderCollapse: 'collapse' }}>
                                                                    <thead >
                                                                        <tr>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle', width: 50 }}>No</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nama Dokumen</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Edit</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                            <th hidden={cookies.userRole !== 4} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Hapus</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listApprovalMaterial.map((docs, index) => {
                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                                        <td>{docs.document_name}</td>
                                                                                        <td hidden={cookies.userRole !== 4} style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setNewDocument(docs)
                                                                                        }}><PencilFill /></Button></td>
                                                                                        <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setStepDocumentId(docs.id)
                                                                                        }}><EyeFill /></Button></td>
                                                                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setDownloadDocumentId(docs.id)
                                                                                        }}><Download /></Button></td>
                                                                                          <td hidden={cookies.userRole !== 4} style={{ textAlign: "center", verticalAlign: "middle" }}><Button variant="danger" style={{ width: 50 }} onClick={() => {
                                                                                            if(window.confirm(`Apakah Anda Ingin Menghapus Data Ini?`)){
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
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="tabSKP" title={`Pemberitahuan Keterlambatan`}>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center"
                                                        }}>
                                                            <div style={{ paddingBottom: 20 }}></div>
                                                            <div hidden={cookies.userRole !== 2} style={{
                                                                display: "flex",
                                                                justifyContent: "flex-end",
                                                                width: "90%",
                                                                paddingRight: 30
                                                            }}>
                                                                <Button variant="primary" style={{
                                                                    width: 130
                                                                }} onClick={() => {
                                                                    setModalDocumentTab2(true)
                                                                    setNewDocument({ ...newDocument, document_type: 5 })
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
                                                                            fontSize: 14,
                                                                        }}>Tambah Data</div>
                                                                    </div>
                                                                </Button>
                                                            </div>
                                                            <div style={{ paddingBottom: 10 }}></div>

                                                            <Table className="packageTableDetail" style={{ width: '90%', borderCollapse: 'collapse' }}>
                                                                <thead >
                                                                    <tr>
                                                                        <th style={{ textAlign: "center", verticalAlign: 'middle' }}>No</th>
                                                                        <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nomor Dokumen</th>
                                                                        <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal</th>
                                                                        <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                        <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        listLateNotice.map((docs, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                                    <td>{docs.document_number}</td>
                                                                                    <td>{docs.start_date ? moment(docs.start_date).format("DD-MM-yyyy") : ""}</td>
                                                                                    <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                        setStepDocumentId(docs.id)
                                                                                    }}><EyeFill /></Button></td>
                                                                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                        setDownloadDocumentId(docs.id)
                                                                                    }}><Download /></Button></td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>









                                                            </Table>


                                                        </div>
                                                    </Tab>
                                                    <Tab disabled={listLateNotice.length === 0} eventKey="tabSCM" title={`Rapat Pembuktian`}>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            padding: 5
                                                        }}>
                                                            {
                                                                cookies.userRole === 2 &&
                                                                <div style={{
                                                                    paddingLeft: 50
                                                                }}>
                                                                    <div>Unduh Format Undangan</div>
                                                                    <Button style={{
                                                                        width: 150,
                                                                        height: 40
                                                                    }} onClick={() => {
                                                                        handleDownloadUndangan()
                                                                    }}><div style={{ display: "flex", fontSize: 11, alignItems: "center" }}><FileWord size={20} /> Unduh Format Word</div> </Button>


                                                                    <div>Unduh Format Berita Acara</div>
                                                                    <Button style={{
                                                                        width: 150,
                                                                        height: 40
                                                                    }} onClick={() => {
                                                                        handleDownloadBA()
                                                                    }}><div style={{ display: "flex", fontSize: 11, alignItems: "center" }}><FileWord size={20} /> Unduh Format Word</div> </Button>



                                                                </div>
                                                            }
                                                            <div style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "center"
                                                            }}>


                                                                <div style={{ paddingBottom: 20 }}></div>
                                                                <div hidden={cookies.userRole !== 2} style={{
                                                                    display: "flex",
                                                                    justifyContent: "flex-end",
                                                                    width: "90%",
                                                                    paddingRight: 30
                                                                }}>
                                                                    <Button variant="primary" style={{
                                                                        width: 130
                                                                    }} onClick={() => {
                                                                        setModalDocumentTab3(true)

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
                                                                                fontSize: 14,
                                                                            }}>Tambah Data</div>
                                                                        </div>
                                                                    </Button>
                                                                </div>
                                                                <div style={{ paddingBottom: 10 }}></div>

                                                                <Table className="packageTableDetail" style={{ width: '90%', borderCollapse: 'collapse' }}>
                                                                    <thead >
                                                                        <tr>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>No</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nomor Dokumen</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal</th>
                                                                            <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Status</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                            <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                            <th hidden={cookies.userRole !== 1} style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Setuju</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listSCMDocument.map((docs, index) => {
                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                                        <td>{docs.document_number}</td>
                                                                                        <td>{docs.start_date ? moment(docs.start_date).format("DD-MM-yyyy") : ""}</td>
                                                                                        <td>{docs.document_status_name}</td>
                                                                                        <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setStepDocumentId(docs.id)
                                                                                        }}><EyeFill /></Button></td>
                                                                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                            setDownloadDocumentId(docs.id)
                                                                                        }}><Download /></Button></td>
                                                                                        <td hidden={cookies.userRole !== 1} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                                                            <Button variant="success" style={{ width: 50 }} onClick={() => {
                                                                                                setApproveId(docs.id);
                                                                                                setDocumentStatus(docs.document_status_name)
                                                                                            }}><CheckLg /></Button></td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>









                                                                </Table>


                                                            </div>
                                                        </div>

                                                    </Tab>
                                                    <Tab disabled={listLateNotice.length === 0} eventKey="tabSP" title={`Surat Peringatan`}>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center"
                                                        }}>
                                                            <div style={{ paddingBottom: 20 }}></div>
                                                            <div hidden={cookies.userRole !== 2} style={{
                                                                display: "flex",
                                                                justifyContent: "flex-end",
                                                                width: "90%",
                                                                paddingRight: 30
                                                            }}>
                                                                <Button variant="primary" style={{
                                                                    width: 130
                                                                }} onClick={() => {
                                                                    setModalDocumentTab2(true)
                                                                    setNewDocument({ ...newDocument, document_type: 8 })
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
                                                                            fontSize: 14,
                                                                        }}>Tambah Data</div>
                                                                    </div>
                                                                </Button>
                                                            </div>
                                                            <div style={{ paddingBottom: 10 }}></div>

                                                            <Table className="packageTableDetail" style={{ width: '90%', borderCollapse: 'collapse' }}>
                                                                <thead >
                                                                    <tr>
                                                                        <th style={{ textAlign: "center", verticalAlign: 'middle' }}>No</th>
                                                                        <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Nomor Dokumen</th>
                                                                        <th style={{ textAlign: "center", verticalAlign: 'middle' }}>Tanggal</th>
                                                                        <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Lihat Dokumen</th>
                                                                        <th style={{ width: 130, textAlign: "center", verticalAlign: 'middle' }}>Unduh</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        listWarningLetter.map((docs, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                                    <td>{docs.document_number}</td>
                                                                                    <td>{docs.start_date ? moment(docs.start_date).format("DD-MM-yyyy") : ""}</td>
                                                                                    <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                        setStepDocumentId(docs.id)
                                                                                    }}><EyeFill /></Button></td>
                                                                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                        setDownloadDocumentId(docs.id)
                                                                                    }}><Download /></Button></td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>









                                                            </Table>


                                                        </div>
                                                    </Tab>
                                                </Tabs>


                                            </div>
                                        </div>
                                    </div>
                                </div>


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
                                    <h3>Dokumen {detailStep.step_name} </h3>
                                </div>

                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    setNewDocument({ ...newDocument, done: true });
                                    setUploadButton(true);
                                    setIsLoading(true);
                                }} style={{ padding: 10 }}>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Jenis Dokumen</Form.Label>
                                        <Form.Select disabled={newDocument.id !== 0} onChange={(e) => {
                                            setNewDocument({ ...newDocument, document_type: e.target.value });
                                        }} value={newDocument.document_type} >
                                            <option disabled selected></option>
                                            <option value={0}>Laporan Harian</option>
                                            <option value={1}>Laporan Mingguan</option>
                                            <option value={2}>Laporan Bulanan</option>
                                            <option value={3}>Laporan Gambar Kerja</option>
                                            <option value={4}>Pengajuan Material</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {
                                        newDocument.document_type !== null &&
                                        <div>
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

                                            {
                                                (newDocument.document_type === "0" || newDocument.document_type === "1" || newDocument.document_type === "2") &&
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Tanggal Dokumen</Form.Label>
                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "row"
                                                    }}>
                                                        <Form.Control onChange={(e) => {
                                                            if (e.target.value === "") {
                                                                setNewDocument({ ...newDocument, start_date: null })
                                                            } else {
                                                                setNewDocument({ ...newDocument, start_date: e.target.value })
                                                            }

                                                        }} value={newDocument.start_date? moment(newDocument.start_date).format("yyyy-MM-DD"): ""} type="date" placeholder="" ></Form.Control>

                                                        {
                                                            (newDocument.document_type === "1" || newDocument.document_type === "2") &&
                                                            <>
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center"
                                                                }}>-</div>
                                                                <Form.Control onChange={(e) => {
                                                                    if (e.target.value === "") {
                                                                        setNewDocument({ ...newDocument, end_date: null })
                                                                    } else {
                                                                        setNewDocument({ ...newDocument, end_date: e.target.value })
                                                                    }

                                                                }} value={newDocument.end_date? moment(newDocument.end_date).format("yyyy-MM-DD"):""} type="date" placeholder="" ></Form.Control>

                                                            </>
                                                        }

                                                    </div>

                                                </Form.Group>
                                            }

                                        </div>
                                    }





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

                        <Modal show={modalDocumentTab2}
                            // dialogClassName="modal-size"
                            size={"lg"}
                            onHide={() => {
                                resetUploadForm();
                                setModalDocumentTab2(false);
                            }}>
                            <div className="details m-2" >
                                <div className="detailscontent">
                                    <h3>Dokumen {detailStep.step_name} </h3>
                                </div>

                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    setNewDocument({ ...newDocument, done: true });
                                    setUploadButton(true);
                                    setIsLoading(true);
                                }} style={{ padding: 10 }}>

                                    <div>
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
                                            <Form.Label>Nomor Dokumen</Form.Label>

                                            <Form.Control onChange={(e) => {
                                                setNewDocument({ ...newDocument, document_number: e.target.value })
                                            }} value={newDocument.document_number} type="text" placeholder="" required></Form.Control>

                                        </Form.Group>


                                        <Form.Group className="mb-3">
                                            <Form.Label>Tanngal Dokumen</Form.Label>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "row"
                                            }}>
                                                <Form.Control onChange={(e) => {
                                                    if (e.target.value === "") {
                                                        setNewDocument({ ...newDocument, start_date: null })
                                                    } else {
                                                        setNewDocument({ ...newDocument, start_date: e.target.value })
                                                    }

                                                }} value={newDocument.start_date} type="date" placeholder="" ></Form.Control>



                                            </div>

                                        </Form.Group>


                                    </div>


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
                                            setModalDocumentTab2(false);
                                        }}>
                                            Batal
                                        </Button>
                                    </div>
                                </Form>



                            </div>

                        </Modal>

                        <Modal show={modalDocumentTab3}
                            // dialogClassName="modal-size"
                            size={"lg"}
                            onHide={() => {
                                resetUploadForm();
                                setModalDocumentTab3(false);
                            }}>
                            <div className="details m-2" >
                                <div className="detailscontent">
                                    <h3>Dokumen {detailStep.step_name} </h3>
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
                                        <Form.Label>Jenis Dokumen</Form.Label>
                                        <Form.Select required onChange={(e) => {
                                            setNewDocument({ ...newDocument, document_type: e.target.value });
                                        }} value={newDocument.document_type} >
                                            <option disabled selected></option>
                                            <option value={6}>Undangan</option>
                                            <option value={7}>Berita Acara</option>

                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nomor Dokumen</Form.Label>

                                        <Form.Control onChange={(e) => {
                                            setNewDocument({ ...newDocument, document_number: e.target.value })
                                        }} value={newDocument.document_number} type="text" placeholder="" required></Form.Control>

                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Tanngal Dokumen</Form.Label>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row"
                                        }}>
                                            <Form.Control onChange={(e) => {
                                                if (e.target.value === "") {
                                                    setNewDocument({ ...newDocument, start_date: null })
                                                } else {
                                                    setNewDocument({ ...newDocument, start_date: e.target.value })
                                                }

                                            }} value={newDocument.start_date} type="date" placeholder="" ></Form.Control>



                                        </div>

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
                                            setModalDocumentTab3(false);
                                        }}>
                                            Batal
                                        </Button>
                                    </div>
                                </Form>



                            </div>

                        </Modal>

                        <Modal size="xl" show={showDocumentApprovedModal} onHide={() => {
                            setShowDocumentApprovedModal(false);
                        }}>
                            <ContainerBox containerPos="inner" titleCaption={documentToBeApproved.document_number}
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

                                            <div hidden={documentStatus === "Disetujui" || documentStatus === "Ditolak"} style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent:"center"
                                            }}>
                                                <Button style={{width:100}} variant="success" onClick={() => {
                                                    ApproveDocument(documentToBeApproved.id, 1)
                                                    setBaApproval(1);
                                                }}  type="submit">Setuju</Button>
                                                <div style={{paddingRight:10}}></div>
                                                <Button style={{width:100}} variant="danger" onClick={() => {
                                                    ApproveDocument(documentToBeApproved.id,0);
                                                    setBaApproval(0)
                                                }}  type="submit">Tolak</Button>
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