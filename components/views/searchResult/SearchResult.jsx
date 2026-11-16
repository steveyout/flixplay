"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchDataFromApi } from "@/utils/api";
import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import MovieCard from "@/components/movieCard/MovieCard";
import Spinner from "@/components/spinner/Spinner";
import noResults from "@/assets/no-results.png";

const SearchResult = ({ params: propParams }) => {
    const routeParams = useParams();
    const rawQuery = propParams?.query || routeParams?.query || "";
    const query = decodeURIComponent(rawQuery);

    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchInitialData = () => {
        if (!query) return;
        setLoading(true);
        fetchDataFromApi(`/search/multi?query=${encodeURIComponent(query)}&page=1`).then(
            (res) => {
                setData(res);
                setPageNum(2);
                setLoading(false);
            }
        );
    };

    const fetchNextPageData = () => {
        if (!query) return;
        fetchDataFromApi(`/search/multi?query=${encodeURIComponent(query)}&page=${pageNum}`).then(
            (res) => {
                if (data?.results) {
                    setData({
                        ...data,
                        results: [...data.results, ...res.results],
                    });
                } else {
                    setData(res);
                }
                setPageNum((prev) => prev + 1);
            }
        );
    };

    useEffect(() => {
        setPageNum(1);
        fetchInitialData();
    }, [query]);

    return (
        <div className="searchResultsPage">
            {loading && <Spinner initial={true} />}
            {!loading && (
                <ContentWrapper>
                    {data?.results?.length > 0 ? (
                        <>
                            <div className="pageTitle">
                                {`Search ${data?.total_results > 1
                                        ? "results"
                                        : "result"
                                    } of '${query}'`}
                            </div>
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || 0}
                                next={fetchNextPageData}
                                hasMore={pageNum <= (data?.total_pages || 1)}
                                loader={<Spinner />}
                            >
                                {data?.results.map((item, index) => {
                                    if (item.media_type === "person") return null;
                                    return (
                                        <MovieCard
                                            key={index}
                                            data={item}
                                            fromSearch={true}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        </>
                    ) : (
                        <div className="resultNotFound" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column" }}>
                            <span className="resultNotFound">
                                Sorry, Results not found!
                            </span>
                            <img src={noResults?.src || noResults} alt="No Results" style={{ maxWidth: "300px", maxHeight: "300px" }} />
                        </div>
                    )}
                </ContentWrapper>
            )}
        </div>
    );
};

export default SearchResult;
