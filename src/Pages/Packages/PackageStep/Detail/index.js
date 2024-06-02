import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Table, Modal } from "react-bootstrap";
import {
    Search, BoxSeam, PencilFill, Trash, Download, FileWord, FileEarmarkText, ChevronDoubleLeft, ChevronDoubleRight,
    FilePlusFill, ArrowClockwise, GearWideConnected, EyeFill, Eye, InfoCircleFill, ZoomIn, ZoomOut, AspectRatioFill,
    XSquareFill,
    CheckLg
} from "react-bootstrap-icons";
import "../../../../App.css"
import { Container } from "react-bootstrap";
import {
    isTokenValid, getPackageStepById, getPackageStep
} from "../../../../Helpers/ApplicationHelper";
import Sidebar from "../../../../Components/Sidebar";
import LoadingAnimation from "../../../../Components/Loading";
import { useCookies } from "react-cookie";
import moment from "moment";
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from "../../../../Components/Navbar";
import Select from "react-select";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { triggerBase64Download } from "../../../../Helpers/Base64Downloader";
import ContainerBox from "../../../../Components/ContainerBox";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PackageStepDetailPage() {
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [stepId, setStepId] = useState("");
    const [stepNumber, setStepNumber] = useState(0);
    const [packageId, setPackageId] = useState("");
    const [listStep, setListStep] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [detailStep, setDetailStep] = useState({});

  

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

    useEffect(()=>{
        if(stepId !== "" && stepId !== null){
            initPackageStep();
        }
    },[stepId]);

    useEffect(()=>{
        if(packageId !== "" && packageId !== undefined){
            loadPackageStep();
        }
    },[])

    const initPackageStep = async()=>{
        try {
            let response = await getPackageStepById(cookies.token, location.state.stepId);
            console.log(response);
            if(response){
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
        link.href = `${process.env.PUBLIC_URL}/docs/example.docx`;
        
        // Set the download attribute with the filename
        link.download = 'example.docx';
        
        // Programmatically click the link to trigger the download
        link.click();
      };


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
                                    display:"flex",
                                    flexDirection:"column",
                                    // height:100,
                                    width:"100%"
                                }}>
                                    <h3>{detailStep.step_name}</h3>
                                </div>
                                <hr></hr>

                                <Button onClick={()=>{
                                    handleDownload()
                                }}>Download Document</Button>
                            </div>




                            <LoadingAnimation
                                isLoading={isLoading}
                            />


                        </div >

                  
                    </Container >
                </div>
            </div >

        </>
    )
}