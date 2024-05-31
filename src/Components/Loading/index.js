import React, { useEffect, useState } from 'react';
import './loading.css';

function LoadingAnimation({
    isLoading
}) {
    
    return (
        <>
            {
                isLoading &&
                <div style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    alignContent: "center"
                    // zIndex: 999,

                }}>
                    <div style={{
                        display: "flex",
                        flex: 1,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",

                        flexDirection: "row",
                        top: window.innerHeight / 5,
                        position: "absolute",
                        width: "30%",
                        height: "30%",
                    }}>
                        <div style={{
                            flex: 1,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "center",

                        }}>
                            <div className="loader"></div>
                            {/* <p>Tes</p> */}
                        </div>

                    </div>
                </div>

            }

        </>

    );
};

export default LoadingAnimation;
