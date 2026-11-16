"use client";

import React from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";

const MovieCard = ({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home);
  const router = useRouter();
  const posterUrl = data?.poster_path
    ? (url?.poster || "https://image.tmdb.org/t/p/w185") + data?.poster_path
    : PosterFallback?.src || PosterFallback;

  const targetMediaType = data?.media_type || mediaType || "movie";

  return (
    <div
      className="movieCard"
      onClick={() => router.push(`/${targetMediaType}/${data?.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} />
        {!fromSearch && (
          <React.Fragment>
            <CircleRating rating={data?.vote_average ? data.vote_average.toFixed(1) : "0.0"} />
            <Genres data={data?.genre_ids?.slice(0, 2)} />
          </React.Fragment>
        )}
      </div>
      <div className="textBlock">
        <span className="title">{data?.title || data?.name}</span>
        <span className="date">
          {dayjs(
            targetMediaType === "tv"
              ? data?.first_air_date
              : data?.release_date
          ).format("MMM D, YYYY")}{" "}
          | ({targetMediaType === "tv" ? "TV" : "Movie"})
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
