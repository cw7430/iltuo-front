import React, { FC } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

interface Props {
    handelLogout: () => void;
    handleShowLoginModal: () => void;
}

const Layout: FC<Props> = ({ handelLogout, handleShowLoginModal }) => {
    return (
        <div>
            <Header handelLogout={handelLogout} handleShowLoginModal={handleShowLoginModal} />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Layout;
