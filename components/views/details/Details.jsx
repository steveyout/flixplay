"use client";

import React from "react";
import { useParams } from "next/navigation";
import "./style.scss";

import useFetch from "@/hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";

const Details = ({ params: propParams }) => {
    const routeParams = useParams();
    const mediaType = propParams?.mediaType || routeParams?.mediaType || "movie";
    const id = propParams?.id || routeParams?.id;

    const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
    const { data: credits, loading: creditsLoading } = useFetch(
        `/${mediaType}/${id}/credits`
    );

    return (
        <div>
            <DetailsBanner
                video={data?.results?.[0]}
                crew={credits?.crew}
                mediaType={mediaType}
                id={id}
            />
            <Cast data={credits?.cast} loading={creditsLoading} />
            <VideosSection data={data} loading={loading} />
            <Similar mediaType={mediaType} id={id} />
            <Recommendation mediaType={mediaType} id={id} />
        </div>
    );
};

export default Details;
