import React from "react";


const vctr = {
    notFound: require("../Images/notfound_img.svg").default
};

const Notfound = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <img src={vctr.notFound} alt="" className="h-[200px]" />
        </div>
    );
};

export default Notfound;