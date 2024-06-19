import { Button, Modal, Form } from "react-bootstrap";
import "../App.css";
import { EyeFill, XSquareFill } from "react-bootstrap-icons";
import { useState } from "react";
import moment from "moment";
import ContainerBox from "./ContainerBox";

export default function DetaiPackage({
    packageDetail
}) {

    const [detailModal, setDetailModal] = useState("");


    const formatCurrency = (value) => {
        // If value is empty or null, return "0"

        if (!value || value.trim() === "") {
            return "0";

        } else {
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
    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                flex: 4,
                // borderStyle: "solid",
                minHeightheight: 300,
                paddingRight: 10
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 4,
                    borderStyle: "inset",
                    // minHeight: 300,

                    // paddingRight: 10
                }}>
                    <div style={{
                        alignItems: "center",
                        backgroundColor: "#498dd9",
                        // borderStyle:"solid"
                        color: "#fff",
                        fontWeight: "bold",
                        borderBottomStyle: "solid",
                        borderColor: "gray"
                    }}>
                        <div style={{ paddingLeft: 10, alignItems: "center", display: "flex", fontSize: 25 }}>
                            <div>Data Paket</div>
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
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: 'nowrap'
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%"
                            }}>
                                <div style={{
                                    display: "flex",
                                    flex: 3
                                }}>Paket</div>
                                <div style={{
                                    display: "flex",
                                    flex: 1
                                }}>:</div>
                                <div style={{
                                    display: "flex",
                                    flex: 4
                                }}>{packageDetail.package_name}</div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: 'nowrap'
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%"
                            }}>
                                <div style={{
                                    display: "flex",
                                    flex: 3
                                }}>Metode Seleksi</div>
                                <div style={{
                                    display: "flex",
                                    flex: 1
                                }}>:</div>
                                <div style={{
                                    display: "flex",
                                    flex: 4
                                }}>{packageDetail.selection_methode}</div>
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: 'nowrap'
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%"
                            }}>
                                <div style={{
                                    display: "flex",
                                    flex: 3
                                }}>Pagu</div>
                                <div style={{
                                    display: "flex",
                                    flex: 1
                                }}>:</div>
                                <div style={{
                                    display: "flex",
                                    flex: 4
                                }}>{formatCurrency(packageDetail.pagu)}</div>
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: 'nowrap'
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%"
                            }}>
                                <div style={{
                                    display: "flex",
                                    flex: 3
                                }}>HPS</div>
                                <div style={{
                                    display: "flex",
                                    flex: 1
                                }}>:</div>
                                <div style={{
                                    display: "flex",
                                    flex: 4
                                }}>{formatCurrency(packageDetail.hps)}</div>
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: 'nowrap'
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%"
                            }}>
                                <div style={{
                                    display: "flex",
                                    flex: 3
                                }}>Kontrak</div>
                                <div style={{
                                    display: "flex",
                                    flex: 1
                                }}>:</div>
                                <div style={{
                                    display: "flex",
                                    flex: 4
                                }}>{formatCurrency(packageDetail.kontrak)}</div>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 20 }}></div>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Button style={{ width: 150 }} onClick={() => {
                                setDetailModal(true);
                            }}><EyeFill /><span>Detail Paket</span></Button>
                        </div>
                    </div>


                </div>
            </div>

            <Modal show={detailModal}
                // dialogClassName="modal-size"
                size={"lg"}
                onHide={() => {

                    setDetailModal(false);
                }}>

                <ContainerBox containerPos="inner" titleCaption={`Detail Paket  `}
                    useActionContainer={true}
                    actionContainerChild={
                        <div>
                            <Button style={{

                            }} onClick={() => {
                                setDetailModal(false);
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
                            flexDirection: "column",
                            padding:10
                        }}>
                            <Form onSubmit={(e) => {

                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: 'nowrap',
                                    width: "100%",
                                    // padding: 10
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: "column",
                                        paddingRight: 10,
                                        flex: 1
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: "column",
                                        }}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nama Paket</Form.Label>
                                                <Form.Control disabled onChange={(e) => {

                                                }} value={packageDetail.package_name} as={"textarea"} rows={3} required></Form.Control>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Metode Pemilihan </Form.Label>
                                                <Form.Control disabled onChange={(e) => {

                                                }} value={packageDetail.selection_methode} required></Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Pagu</Form.Label>
                                                <Form.Control disabled onChange={(e) => {

                                                }} value={formatCurrency(packageDetail.pagu)} required></Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>HPS </Form.Label>
                                                <Form.Control disabled onChange={(e) => {

                                                }} value={formatCurrency(packageDetail.hps)} required></Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Kontrak</Form.Label>
                                                <Form.Control disabled onChange={(e) => {


                                                }} value={formatCurrency(packageDetail.kontrak)} ></Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nama PPK</Form.Label>
                                                <Form.Control disabled onChange={(e) => {

                                                }} value={packageDetail.ppk_name} ></Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nama Penyedia </Form.Label>
                                                {/* <Form.Control disabled={cookies.userRole !== 2} type="text" onChange={(e) => {
                                setPackages({ ...packageDetail, provider_name: e.target.value })
                            }} value={packageDetail.provider_name} ></Form.Control> */}
                                                <Form.Control disabled value={packageDetail.providername}></Form.Control>
                                            </Form.Group>

                                        </div>

                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: "column",
                                        paddingLeft: 10,
                                        flex: 1
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: "column",


                                        }}>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Konsultan Perencana</Form.Label>
                                                <Form.Control disabled value={packageDetail.planing_consultant} onChange={(e) => {

                                                }}></Form.Control>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Konsultan Pengawas</Form.Label>
                                                <Form.Control disabled value={packageDetail.supervising_consultan} onChange={(e) => {

                                                }}></Form.Control>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Nomor Kontrak</Form.Label>
                                                <Form.Control disabled value={packageDetail.contract_number} onChange={(e) => {

                                                }}></Form.Control>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Status Paket</Form.Label>
                                                <Form.Control disabled value={packageDetail.status_name}></Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tanggal Mulai</Form.Label>
                                                <Form.Control disabled type="date" onChange={(e) => {

                                                }} value={packageDetail.start_date ? moment(packageDetail.start_date).format("yyyy-MM-DD") : ""} ></Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tanggal Selesai</Form.Label>
                                                <Form.Control disabled type="date" onChange={(e) => {

                                                }} value={packageDetail.end_date ? moment(packageDetail.end_date).format("yyyy-MM-DD") : ""} ></Form.Control>
                                            </Form.Group>

                                        </div>


                                    </div>
                                </div>




                            </Form>
                        </div>
                    } />



            </Modal>
        </>
    )
};