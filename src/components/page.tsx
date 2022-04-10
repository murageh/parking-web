// @ts-nocheck
import React, {useEffect, useState} from "react";
import Header from "./header";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useLocation, useNavigate} from "react-router-dom";
import Loading from "../utils/loading";

function BasePage({children}) {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const role = sessionStorage.getItem("role");
    const [isVerifying, setVerifying] = useState(true);

    let location = useLocation();
    const {pathname} = location;

    console.log(pathname)

    useEffect(() => {
        if (!(username && isLoggedIn && role) && pathname !== "/login") {
            navigate("/login");
        }

        // if (role === "ADMIN" && pathname === "/") {
        //     navigate("/admin", { replace: true});
        // }

        setVerifying(false);
    }, [])

    return (
        isVerifying
            ? <Loading/>
            :
            <>
                <Header/>
                <ToastContainer/>
                {children}
                <footer className={"footer"}>
                    &copy; Parking Management System&nbsp; {new Date().getFullYear()}.
                </footer>
            </>
    );
}

export default BasePage;