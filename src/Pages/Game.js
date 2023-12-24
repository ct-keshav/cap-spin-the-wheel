import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";



const Game = () => {
    const nav = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const email = queryParams.get("email");
    const phone = queryParams.get("phone");

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            nav("/");
        } else {
            sessionStorage.setItem("user", true);
        }
    }, [nav])


    return (
        <>
            <iframe
                src={`https://constellation.customerglu.com/program/?writekey=dc2a1eb9643226559d07d6c080e5d5f1a3dbbb1a&campaignId=b0ab89fe-826a-4eb6-9a4f-a3ef4ea97f53&userId=${phone}`}
                title="Celebration Video"
                className="w-[100dvw] h-[100dvh]"
            >
            </iframe >
        </>
    );
};

export default Game;
