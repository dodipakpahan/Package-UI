import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"
import { useCookies } from "react-cookie";
import { isTokenValid } from "../../Helpers/ApplicationHelper";
import axios from "axios";
import config from "../../Config/config";
import { Button, Form } from "react-bootstrap";


export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);
    const [cookies, setCookie] = useCookies(["token", "userId", "userName", "userEmail"]);
    const [errorMessage, setErrorMessage] = useState("");
    const txtUsername = useRef(null);
    const txtPassword = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        async function checkCookies() {
            if (cookies.token) {
                let isAuthenticated = await isTokenValid(cookies.token);
                if (isAuthenticated)
                    navigate("/Dashboard");
            } else {
                navigate("/");
            }
        }
        checkCookies();
        let interval = setInterval(() => {
            if (txtPassword.current) {
                setPassword(txtPassword.current.value);
                clearInterval(interval);
            }
        }, 100);
        let interval2 = setInterval(() => {
            if (txtUsername.current) {
                setUsername(txtUsername.current.value)
                clearInterval(interval2)

            }
        }, 100);

    }, []);

    useEffect(() => {
        checkUsernamePasswordLength();
    }, [username]);

    useEffect(() => {
        checkUsernamePasswordLength();
    }, [password]);


    const login = async () => {
        try {
            let response = await axios.post(`${config.API_ENDPOINT}/api/UserAccount/login`, {
                username: username,
                password: password
            });
            console.log(response);
            if (response.data.error_code === 0 ) {
                let loginData = response.data.data;
                setCookie("token", loginData.token, { path: "/" });
                setCookie("userId", loginData.user_account_id, { path: "/" });
                setCookie("userName", loginData.username, { path: "/" });
                setCookie("userEmail", loginData.email, { path: "/" });
                setCookie("userRole", loginData.user_role, { path: "/" });
                navigate("/Dashboard");
            } else {
                setErrorMessage("Failed to sign in, wrong username and/or password.");
            }

        }
        catch (exception) {
            console.log(exception);
            setErrorMessage("Error has been occurred, please contact system administrator");
        }
    }

    const checkUsernamePasswordLength = () => {
        if (username.length > 0 && password.length > 0)
            setLoginButtonDisabled(false);
        else
            setLoginButtonDisabled(true);
    }


    return (
        <>
            <div class="loginPage">
                <div class="login-container">
                    <h2>Welcome Back!</h2>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        login()
                    }}>
                        <div class="form-group">
                            <label className="label" for="username">Username</label>
                            <input type="text" id="username" name="username" onChange={(e)=>{
                                setUsername(e.target.value)
                            }} required />
                        </div>
                        <div class="form-group">
                            <label className="label" for="password">Password</label>
                            <input type="password" id="password" name="password" required onChange={(e)=>{
                                setPassword(e.target.value)
                            }} />
                        </div>
                        {
                            errorMessage && <p style={{ color: "red", textAlign:'center' }}>{errorMessage}</p>
                        }
                        <div style={{
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            width:"100%"
                        }}>

                            <Button className="button" type="submit">Login</Button>

                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}