import axios from "axios";

const BASE_URL = "https://proxy.shivamch17.workers.dev/?url=";
const API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN =
    process.env.NEXT_PUBLIC_TMDB_TOKEN ||
    process.env.VITE_APP_TMDB_TOKEN ||
    process.env.TMDB_TOKEN ||
    "";

const defaultHeaders = TMDB_TOKEN
    ? { Authorization: "Bearer " + TMDB_TOKEN }
    : {};

export const fetchDataFromApi = async (url, params) => {
    try {
        const encodedUrl = encodeURIComponent(API_URL + url);
        const { data } = await axios.get(`${BASE_URL}${encodedUrl}`, {
            headers: defaultHeaders,
            params: {
                ...(!TMDB_TOKEN ? { api_key: "1cf50e6248dc270629e802686245c2c8" } : {}),
                ...params,
            },
        });

        return data;
    } catch (err) {
        console.log("fetchDataFromApi error:", err);
        return err;
    }
};
