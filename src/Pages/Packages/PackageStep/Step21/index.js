import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Table, Modal } from "react-bootstrap";
import {
    Search, BoxSeam, PencilFill, Trash, Download, FileWord, FileEarmarkText, ChevronDoubleLeft, ChevronDoubleRight,
    FilePlusFill, ArrowClockwise, GearWideConnected, EyeFill, Eye, InfoCircleFill, ZoomIn, ZoomOut, AspectRatioFill,
    XSquareFill,
    CheckLg,
    ArrowLeft
} from "react-bootstrap-icons";
import "../../../../App.css"
import { Container } from "react-bootstrap";
import {
    isTokenValid, getPackageStepById, getPackageStep, getPackageById, convertBase64,
    insertUpdatePackageStep21,
    getPackageStep21ById,
    getPackageStep21Document,
    updateStep21DocumentStatus
} from "../../../../Helpers/ApplicationHelper";
import Sidebar from "../../../../Components/Sidebar";
import LoadingAnimation from "../../../../Components/Loading";
import { useCookies } from "react-cookie";
import webLogo from "../../../../Assets/images/log-silikon-removebg-preview.png"

import moment from "moment";
import { Document, Page, pdfjs } from 'react-pdf';
import backLogo from "../../../../Assets/images/leftArrow.png"
import DetaiPackage from "../../../../Components/DetailPackage";
import Navbar from "../../../../Components/Navbar";
import Select from "react-select";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { triggerBase64Download } from "../../../../Helpers/Base64Downloader";
import ContainerBox from "../../../../Components/ContainerBox";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PackageStep21Page() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [stepId, setStepId] = useState("");
    const [listDocument, setListDocument] = useState([]);
    const [stepNumber, setStepNumber] = useState(0);
    const [packageId, setPackageId] = useState("");
    const [listStep, setListStep] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [detailStep, setDetailStep] = useState({});
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
    }, [stepDocumentId])

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
        if (downloadDocumentId !== "")
            downloadData()
    }, [downloadDocumentId]);

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
        link.href = `${process.env.PUBLIC_URL}/docs/format_laporan_pekerjaan.pdf`;

        // Set the download attribute with the filename
        link.download = 'format_laporan_pekerjaan.pdf';

        // Programmatically click the link to trigger the download
        link.click();
    };



    const initPackage = async () => {
        try {
            let response = await getPackageById(cookies.token, location.state.packageId);
            if (response) {
                setDetailPackage(response);
            }
        } catch (exception) {

        }
    }

    const uploadDocument = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await insertUpdatePackageStep21(cookies.token, newDocument, packageId, window.location.pathname);
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

    const resetUploadForm = () => {
        let newDocument = {
            id: 0,
            package_step_id: stepId,
            url_base64: "",
            description: "",
            document_name: "",
            is_active: true,
        };
        setNewDocument(newDocument);
        setDocumentId("");
    }

    const downloadData = async () => {
        try {
            let response = await getPackageStep21ById(cookies.token, downloadDocumentId);
            triggerBase64Download(response.url_base64, response.document_name);
            setIsLoading(false);
            setDownloadDocumentId("");
        } catch (exception) {
            console.log(exception);
        }
    }



    const loadDocumentData = async () => {
        try {

            let listDocument = await getPackageStep21Document(cookies.token, stepId);
            console.log(listDocument)
            setListDocument(listDocument);
            setIsLoading(false);
        } catch (exception) {
            console.log(exception);
        }
    }



    const loadDocumentById = async () => {
        try {
            let response = await getPackageStep21ById(cookies.token, stepDocumentId);
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
            let response = await getPackageStep21ById(cookies.token, approveId);
            setDocumentToBeApproved(response);
            setIsLoading(false);
        } catch (exception) {
            console.log(exception)
        }
    }

    const ApproveDocument = async (documentId) => {
        try {
            let stepPayload = {}
            stepPayload.id = documentId;
            stepPayload.package_id = packageId;
            stepPayload.package_step_id = stepId;
            stepPayload.path = window.location.pathname;
            stepPayload.provider_name = detailPackage.provider_name;
            stepPayload.document_type = documentToBeApproved.document_type;
            let response = await updateStep21DocumentStatus(cookies.token, stepPayload);
            if (response.error_code === 0) {
                alert('Dokumen Telah Disetujui');
                loadDocumentData();
            } else {
                alert('Gagal Menyetujui Dokumen')
            }
            setShowDocumentApprovedModal(false);
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
                                    <DetaiPackage
                                        packageDetail={detailPackage}
                                    />

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
                                                {
                                                   ( cookies.userRole === 4 || cookies.userRole === 2 )&&
                                                    <>
                                                        <div>Unduh Format Dokumen</div>
                                                        <Button style={{
                                                            width: 150,
                                                            height: 40
                                                        }} onClick={() => {
                                                            handleDownload()
                                                        }}><div style={{ display: "flex", fontSize: 11, alignItems: "center" }}><FileWord size={20} /> Unduh Format Word</div> </Button>



                                                    </>
                                                }


                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column"
                                                }}>
                                                    <div style={{ paddingBottom: 20 }}></div>
                                                    <div hidden={cookies.userRole !== 4 && cookies.userRole !== 2} style={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        width: "100%",
                                                        paddingRight: 30
                                                    }}>
                                                        <Button hidden={cookies.userRole === 4 ?listDocument.length > 0 :( listDocument.length >4 || listDocument.length<1)} variant="primary" style={{
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
                                                    <Table striped bordered hover>
                                                        <thead >
                                                            <tr>
                                                                <th style={{ textAlign: "center", verticalAlign: "middle" }}>Nama Dokumen</th>
                                                                <th style={{ textAlign: "center", verticalAlign: "middle" }}>Status</th>
                                                                <th style={{ textAlign: "center", verticalAlign: "middle" }}>Keterangan</th>
                                                                <th style={{ width: 130, textAlign: "center", verticalAlign: "middle" }}>Lihat Dokumen</th>
                                                                <th style={{ width: 130, textAlign: "center", verticalAlign: "middle" }}>Unduh</th>
                                                                <th style={{ width: 120, textAlign: "center", verticalAlign: "middle" }} hidden={cookies.userRole !== 1}>Setuju</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                listDocument.map((docs, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{docs.document_name}</td>
                                                                            <td>{docs.document_status_name}</td>
                                                                            <td>{docs.description}</td>
                                                                            <td style={{ textAlign: "center" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                setStepDocumentId(docs.id)
                                                                            }}><EyeFill /></Button></td>
                                                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}><Button style={{ width: 50 }} onClick={() => {
                                                                                setDownloadDocumentId(docs.id)
                                                                            }}><Download /></Button></td>
                                                                            <td style={{ textAlign: "center" }} hidden={cookies.userRole !== 1 }><Button variant="success" hidden={!docs.document_status_name} style={{ width: 50 }} onClick={() => {
                                                                                setApproveId(docs.id);
                                                                                setDocumentStatus(docs.document_status_name)
                                                                                // if(docs.document_status_name === "Apporved"){
                                                                                //     setDocumentStatus("Approved")
                                                                                // }
                                                                            }}><CheckLg /></Button></td>


                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>

                                                    </Table>
                                                </div>



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

                                    <Form.Group className="mb-3">
                                        <Form.Label>Keterangan</Form.Label>

                                        <Form.Control onChange={(e) => {
                                            setNewDocument({ ...newDocument, description: e.target.value })
                                        }} value={newDocument.description} as="textarea" rows={3} placeholder="" ></Form.Control>

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


                                            <Button variant="success" onClick={() => {
                                                ApproveDocument(documentToBeApproved.id)
                                            }} hidden={documentStatus === "Disetujui"} type="submit">Setuju</Button>

                                        </div>
                                    </div>
                                } />

                        </Modal>



                    </Container >
                </div >
            </div >

        </>
    )
}