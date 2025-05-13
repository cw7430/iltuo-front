import React, { useState } from "react";
import { useAuthStore } from "./stores";
import { fetchCheckLogin } from "./apis/server/Auth";
import { Loader } from "./components/Gif";

const AuthInitializer = () => {

    const [ready, setReady] = useState<boolean>(false);

    if (!ready) return <Loader />;

    return (
        <></>
    )
}

export default AuthInitializer;
