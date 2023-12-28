import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Game = () => {
    const nav = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const email = queryParams.get("email");
    const phone = queryParams.get("phone");

    const [campaignUrl, setCampaignUrl] = useState("");

    //handles page reload redirection
    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            nav("/");
        } else {
            sessionStorage.setItem("user", true);
        }
    }, [nav])

    //fetches the campaignUrl stored in localStorage
    useEffect(() => {
        const campaignUrl = localStorage.getItem("campaignUrl");
        setCampaignUrl(campaignUrl);
    }, [campaignUrl, setCampaignUrl])

    return (
        <>
            {campaignUrl && <iframe
                src={campaignUrl}
                title="Celebration Video"
                className="w-[100dvw] h-[100dvh]"
            ></iframe>}
        </>
    );
};

export default Game;
