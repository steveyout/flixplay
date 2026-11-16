"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./style.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ContinueWatching = () => {
    const router = useRouter();
    const [continueWatching, setContinueWatching] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("continue_watching") || "[]");
            setContinueWatching(data);
        }
    }, []);

    const handleRemove = (id, mediaType, event) => {
        event.stopPropagation();
        const updatedList = continueWatching.filter(
            item => !(item.id === id && item.mediaType === mediaType)
        );
        setContinueWatching(updatedList);
        if (typeof window !== "undefined") {
            localStorage.setItem("continue_watching", JSON.stringify(updatedList));
        }
    };

    const handleClick = (item) => {
        if (item.mediaType === "tv") {
            router.push(`/player/${item.mediaType}/${item.id}/${item.season}/${item.episode}`);
        } else {
            router.push(`/player/${item.mediaType}/${item.id}`);
        }
    };

    if (continueWatching.length === 0) return null;

    return (
        <div className="continueWatchingSection">
            <ContentWrapper>
                <div className="sectionHeading">Continue Watching</div>
                <div className="content">
                    {continueWatching.map((item) => (
                        <div 
                            key={`${item.id}-${item.mediaType}`} 
                            className="movieCard" 
                            onClick={() => handleClick(item)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="posterBlock">
                                <div 
                                    className="removeButton"
                                    onClick={(e) => handleRemove(item.id, item.mediaType, e)}
                                >
                                    ✕
                                </div>
                                <Img src={item.poster_path} />
                                {item.mediaType === "tv" && (
                                    <div className="episodeInfo">
                                        S{item.season} E{item.episode}
                                    </div>
                                )}
                                <div className="timeInfo">
                                    {dayjs(item.timestamp).fromNow()}
                                </div>
                            </div>
                            <div className="textBlock">
                                <span className="title">
                                    {item.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default ContinueWatching;
