import React from 'react';
import './App.css';
import {AccountCircleOutlined, LockOutlined} from "@mui/icons-material";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Home from "./views/home";
import List from "./views/admin/list";
import Login from "./views/authentication/login";
import NewParking from "./views/newParking";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/" element={<Home/>} />

                    <Route path="/users" element={<List type={"users"}/>}/>
                    <Route path="/parking" element={<List type={"parking"}/>}/>
                    <Route path="/payments" element={<List type={"payments"}/>}/>
                    <Route path="/newParking" element={<NewParking />}/>

                    <Route path="*" element={<Home />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
