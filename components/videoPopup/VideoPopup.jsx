"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./style.scss";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
    ssr: false,
});

const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const hidePopup = () => {
        setShow(false);
        setVideoId(null);
    };

    if (!show || !mounted) return null;

    return (
        <div className={`videoPopup ${show ? "visible" : ""}`}>
            <div className="opacityLayer" onClick={hidePopup}></div>
            <div className="videoPlayer">
                <span className="closeBtn" onClick={hidePopup}>
                    Close
                </span>
                {videoId && (
                    <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        controls
                        width="100%"
                        height="100%"
                    />
                )}
            </div>
        </div>
    );
};

export default VideoPopup;
