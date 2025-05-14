import React, { FC } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

interface Props {
    handelLogout: () => void;
}

const Layout : FC<Props> = ({ handelLogout }) => {
    return (
        <div>
            <Header handelLogout={handelLogout} />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;
