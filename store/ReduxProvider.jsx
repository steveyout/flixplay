"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { fetchDataFromApi } from "../utils/api";
import { getApiConfiguration, getGenres } from "./homeSlice";

function StoreInitializer({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApiConfig = () => {
            fetchDataFromApi("/configuration").then((res) => {
                if (res?.images?.secure_base_url) {
                    const url = {
                        backdrop: res.images.secure_base_url + "w1280",
                        poster: res.images.secure_base_url + "w185",
                        profile: res.images.secure_base_url + "w185",
                    };
                    dispatch(getApiConfiguration(url));
                }
            });
        };

        const genresCall = async () => {
            try {
                let promises = [];
                let endPoints = ["tv", "movie"];
                let allGenres = {};

                endPoints.forEach((url) => {
                    promises.push(fetchDataFromApi(`/genre/${url}/list`));
                });

                const data = await Promise.all(promises);
                data?.forEach((item) => {
                    if (item?.genres) {
                        item.genres.forEach((g) => {
                            allGenres[g.id] = g;
                        });
                    }
                });

                dispatch(getGenres(allGenres));
            } catch (err) {
                console.error("Failed to fetch genres:", err);
            }
        };

        fetchApiConfig();
        genresCall();
    }, [dispatch]);

    return <>{children}</>;
}

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <StoreInitializer>{children}</StoreInitializer>
        </Provider>
    );
}
