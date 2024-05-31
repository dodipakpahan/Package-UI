import React, { useState } from "react";
// import { Pagination, Dropdown, Row, Col, Button } from 'react-bootstrap';
import { SortUpAlt, SortDown } from "react-bootstrap-icons";
import { Pagination, Dropdown, Button } from "react-bootstrap";

import "./Pagination.css"

function Paginations({
    itemPerPage,
    totalPage,
    page,
    setPage,
    setItemPerPage,
    itemPerPageSelection,
    orderBy,
    setOrderBy,
    orderBySelection,
    isDescActive,
    setIsDescActive,
    setIsSearched
}) {
    let pages = [];
    // for(let i = Math.max(0, page-1); i <= Math.min(page + 1, totalPage); i++){
    //     pages.push(<Pagination.Item key={i} active={page === i} onClick={() => {

    //         setPage(i);
    //     }}>{i + 1}</Pagination.Item>)
    // }
    for (let i = page; i < Math.min(page + 4, totalPage); i++) {
        pages.push(<Pagination.Item key={i} active={page === i} onClick={() => {

            setPage(i);
            setIsSearched(1);
        }}>{i + 1}</Pagination.Item>)
    }
    // for (let i = 0; i < totalPage; i++) {
    //     pages.push(<Pagination.Item key={i} active={page === i} onClick={() => {

    //         setPage(i);
    //     }}>{i + 1}</Pagination.Item>)
    // }


    const handleRotationFirst = () => {
        // console.log('tes');

        setPage(0);
        setIsSearched(1);
    }

    const handleRotationLast = () => {

        setPage(Math.ceil(totalPage) - 1);
        setIsSearched(1);

    }

    const handleRotationLeft = () => {
        // console.log('tes');
        if (page > 0) {
            // console.log('kurang');
            setPage(page - 1);
            setIsSearched(1);

        }
    }

    const handelRotationRight = () => {
        // console.log('tes');
        if (page < totalPage - 1) {
            // console.log('tambah');
            setPage(page + 1);
            setIsSearched(1);
        }
    }
    return (
        <>
            {
                setItemPerPage === undefined ?
                    <></> :
                    <div className="pagination-head">
                        <div className="pagination-detail">
                            <Dropdown onSelect={(e) => {
                                setItemPerPage(itemPerPageSelection[e]);
                                setPage(0);
                                setIsSearched(1);

                            }}>
                                <Dropdown.Toggle>
                                    {itemPerPage}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        itemPerPageSelection.map((i, j) => {
                                            return (
                                                <Dropdown.Item key={j} eventKey={j} href="#">{i}</Dropdown.Item>
                                            )
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="pagination-detail">
                            <Dropdown onSelect={(e) => {
                                setOrderBy(orderBySelection[e]);
                                setPage(0);
                                setIsSearched(1);

                            }}>
                                <Dropdown.Toggle>
                                    {orderBy.label}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        orderBySelection.map((i, j) => {
                                            return (
                                                <Dropdown.Item key={j} eventKey={j} href="#">{i.label}</Dropdown.Item>
                                            )
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="pagination-detail">


                            <Button className="mb-1 justify-content-end" variant="primary"
                                onClick={() => {
                                    {
                                        isDescActive === 'true' ?
                                            setIsDescActive(!isDescActive)
                                            :
                                            setIsDescActive(!isDescActive)

                                    }
                                    setIsSearched(1);

                                }}
                            >

                                {
                                    isDescActive ?
                                        <SortDown />
                                        :
                                        <SortUpAlt />

                                }

                               
                            </Button>

                        </div>

                    </div>
            }

            <br />
            <Pagination>
                <Pagination.First onClick={handleRotationFirst} />
                <Pagination.Prev onClick={handleRotationLeft} />
                {
                    pages
                }

                <Pagination.Next onClick={handelRotationRight} />
                <Pagination.Last onClick={handleRotationLast} />
            </Pagination>
           
        </>

    )


}

export default Paginations;
