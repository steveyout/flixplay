"use client";

import React from "react";
import { useRouter } from "next/navigation";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";

const AnimeCard = ({ data }) => {
    const router = useRouter();
    return (
        <div
            className="movieCard"
            onClick={() => {
                if (typeof window !== "undefined") {
                    localStorage.setItem("current_backdrop_path", data?.thumb || "");
                }
                router.push(`/player/anime/${data?.slug}`);
            }}
            style={{ cursor: "pointer" }}
        >
            <div className="posterBlock">
                <Img
                    className="posterImg"
                    src={(!data?.thumb) ? (PosterFallback?.src || PosterFallback) : data?.thumb}
                />
                <Genres data={data} type={"anime"} />
            </div>
            <div className="textBlock">
                <span className="title">{data?.name}</span>
                <span className="date">
                    {data?.released_year || ""} | (Anime)
                </span>
            </div>
        </div>
    );
};

export default AnimeCard;
