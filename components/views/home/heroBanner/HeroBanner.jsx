"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./style.scss";

import useFetch from "@/hooks/useFetch";
import Img from "@/components/lazyLoadImage/Img";
import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import { getDomainConfig } from "@/utils/seo";

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [query, setQuery] = useState("");
    const [domainConfig, setDomainConfig] = useState(() => getDomainConfig(""));
    const router = useRouter();
    const { data, loading } = useFetch("/movie/popular");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setDomainConfig(getDomainConfig(window.location.hostname));
        }
    }, []);

    useEffect(() => {
        const bg =
            "https://image.tmdb.org/t/p/w1280" +
            data?.results?.[Math.floor(Math.random() * (data?.results?.length || 18))]?.backdrop_path;
        if (bg && !bg.includes("undefined")) {
            setBackground(bg);
        }
    }, [data, loading]);

    const searchQueryHandler = () => {
        if (query.trim().length > 0) {
            router.push(`/search/${encodeURIComponent(query.trim())}`);
        }
    };
    const searchBtnClick = () => {
        if (query.trim().length > 0) {
            router.push(`/search/${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="heroBanner">
            {!loading && background && (
                <div className="backdrop-img">
                    <Img src={background} />
                </div>
            )}

            <div className="opacity-layer"></div>
            <ContentWrapper>
                <div className="heroBannerContent">
                    <span className="title">{domainConfig.heroTitle}</span>
                    <span className="subTitle">{domainConfig.heroSubtitle}</span>
                    <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search for a movie or tv show...."
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchQueryHandler();
                                }
                            }}
                        />
                        <button onClick={searchBtnClick}>Search</button>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default HeroBanner;
