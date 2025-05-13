import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./assets/css/jquery.mCustomScrollbar.min.css";
import AppInitializer from "./AppInitializer";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { MAIN_PATH, PLAIN_PATH, LIST_PATH, DETAIL_PATH } from "./constants/url";
import Main from "./views/Main";
import { useAuthStore, useMajorCategoryStore, useRecommendedProductStore } from "./stores";
import ProductList from "./views/Product/ProductList";
import ProuctDetail from "./views/Product/ProductDetail";
import SignUp from "./views/Auth/SignUp";

function App() {
    const fetchMajorCategoryList = useMajorCategoryStore((state) => state.fetchData);

    const fetchRecommendedProductList = useRecommendedProductStore((state) => state.fetchData);

    useEffect(() => {
        fetchMajorCategoryList();
        fetchRecommendedProductList();
    }, [fetchMajorCategoryList, fetchRecommendedProductList]);

    return (
        <AppInitializer>
            <Routes>
                <Route element={<Layout />}>
                    <Route path={MAIN_PATH()} element={<Main />} />
                    <Route
                        path={LIST_PATH("product", ":majorCategoryId")}
                        element={<ProductList />}
                    />
                    <Route path={DETAIL_PATH("product", ":productId")} element={<ProuctDetail />} />
                    <Route path={PLAIN_PATH("sign_up", null)} element={<SignUp />} />
                </Route>
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </AppInitializer>
    );
}

export default App;
