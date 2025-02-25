import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./assets/css/jquery.mCustomScrollbar.min.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { MAIN_PATH } from "./constants";
import Main from "./views/Main";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path={MAIN_PATH()} element={<Main />} />
            </Route>
            <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
    );
}

export default App;
