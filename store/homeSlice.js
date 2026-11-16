import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
    name: "home",
    initialState: {
        url: {
            backdrop: "https://image.tmdb.org/t/p/w1280",
            poster: "https://image.tmdb.org/t/p/w185",
            profile: "https://image.tmdb.org/t/p/w185",
        },
        genres: {},
    },
    reducers: {
        getApiConfiguration: (state, action) => {
            state.url = action.payload;
        },
        getGenres: (state, action) => {
            state.genres = action.payload;
        },
    },
});

export const { getApiConfiguration, getGenres } = homeSlice.actions;

export default homeSlice.reducer;
