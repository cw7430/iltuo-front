import React, { useEffect } from "react";
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
import { MAIN_PATH, LIST_PATH, DETAIL_PATH } from "./constants";
import Main from "./views/Main";
import { useMajorCategoryStore, useRecommendedProductStore } from "./stores";
import { RecommendedProductsRequestDto } from "./apis/dto/request/Products";
import ProductList from "./views/Product/ProductList";
import ProuctDetail from "./views/Product/ProductDetail";

function App() {
    const fetchMajorCategoryList = useMajorCategoryStore(
        (state) => state.fetchData
    );

    const fetchRecommendedProductList = useRecommendedProductStore(
        (state) => state.fetchData
    );

    useEffect(() => {
        fetchMajorCategoryList();
        fetchRecommendedProductList({
            isRecommended: true,
        } as RecommendedProductsRequestDto);
    }, [fetchMajorCategoryList, fetchRecommendedProductList]);

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path={MAIN_PATH()} element={<Main />} />
                <Route path={LIST_PATH("product", ":majorCategoryId")} element={<ProductList />} />
                <Route path={DETAIL_PATH("product", ":productId")} element={<ProuctDetail/>} />
            </Route>
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    );
}

export default App;
