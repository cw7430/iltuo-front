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
import { MAIN_PATH, SHOP_PATH } from "./constants";
import Main from "./views/Main";
import { useMajorCategoryStore, useRecommendatedProductStore } from "./stores";
import { RecommendatedProductsRequestDto } from "./apis/dto/request/Products";

function App() {
    const fetchMajorCategoryList = useMajorCategoryStore(
        (state) => state.fetchData
    );

    const fetchRecommendatedProductList = useRecommendatedProductStore(
        (state) => state.fetchData
    );

    useEffect(() => {
        fetchMajorCategoryList();
        fetchRecommendatedProductList({
            isRecommendated: true,
        } as RecommendatedProductsRequestDto);
    }, [fetchMajorCategoryList, fetchRecommendatedProductList]);

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path={MAIN_PATH()} element={<Main />} />
                <Route path={SHOP_PATH()} element={<h1>shop</h1>} />
            </Route>
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    );
}

export default App;
