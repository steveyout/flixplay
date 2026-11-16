"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import "./style.scss";
import Img from "@/components/lazyLoadImage/Img";
import useFetch from "@/hooks/useFetch";

const sources = [
  {
    embedcc: [
      "https://www.2embed.cc/embed/ID",
      "https://www.2embed.cc/embedtv/ID&s=sea&e=epi",
    ],
  },
  {
    smashstream: [
      "https://embed.smashystream.com/playere.php?tmdb=ID",
      "https://embed.smashystream.com/playere.php?tmdb=ID&season=sea&episode=epi",
    ],
  },
  {
    multiembed: [
      "https://multiembed.mov/?video_id=ID&tmdb=1",
      "https://multiembed.mov/?video_id=ID&tmdb=1&s=sea&e=epi",
    ],
  },
  {
    multiembedvip: [
      "https://multiembed.mov/directstream.php?video_id=ID&tmdb=1",
      "https://multiembed.mov/directstream.php?video_id=ID&tmdb=1&s=sea&e=epi",
    ],
  },
  {
    vidsrc: [
      "https://embed.su/embed/movie/ID",
      "https://embed.su/embed/tv/ID/sea/epi",
    ],
  },
  {
    moviesapi: [
      "https://moviesapi.club/movie/ID",
      "https://moviesapi.club/tv/ID-sea-epi",
    ],
  },
  {
    remotestream: [
      "https://vidlink.pro/movie/ID",
      "https://vidlink.pro/tv/ID/sea/epi",
    ],
  },
];

const Player = ({ params: propParams }) => {
  const routeParams = useParams();
  const mediaType = propParams?.mediaType || routeParams?.mediaType || "movie";
  const id = propParams?.id || routeParams?.id;
  const urlSeason = propParams?.season || routeParams?.season;
  const urlEpisode = propParams?.episode || routeParams?.episode;

  const [selectedSeason, setSelectedSeason] = useState(urlSeason ? parseInt(urlSeason, 10) : 1);
  const [selectedEpisode, setSelectedEpisode] = useState(urlEpisode ? parseInt(urlEpisode, 10) : 1);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(6);
  const [selectedSource, setSelectedSource] = useState("");
  const router = useRouter();
  const { url } = useSelector((state) => state.home);

  // Fetch media details
  const { data: mediaDetails, loading } = useFetch(`/${mediaType}/${id}`);
  const backdrop_path = mediaDetails?.backdrop_path
    ? "https://image.tmdb.org/t/p/w1280" + mediaDetails.backdrop_path
    : "";
  const seasonsDataTemp = mediaDetails?.seasons || [];
  const seasonsData = seasonsDataTemp?.filter(
    (season) => season?.name !== "Specials"
  );

  const makeSource = () => {
    let chosenSource = "";
    let epi = selectedEpisode;
    let sea = selectedSeason;
    let index = selectedSourceIndex;

    if (mediaType === "tv") {
      switch (index || 0) {
        case 0:
          chosenSource = sources[0].embedcc[1].replace(
            "ID&s=sea&e=epi",
            `${id}&s=${sea}&e=${epi}`
          );
          break;
        case 1:
          chosenSource = sources[1].smashstream[1].replace(
            "ID&season=sea&episode=epi",
            `${id}&season=${sea}&episode=${epi}`
          );
          break;
        case 2:
          chosenSource = sources[2].multiembed[1].replace(
            "ID&tmdb=1&s=sea&e=epi",
            `${id}&tmdb=1&s=${sea}&e=${epi}`
          );
          break;
        case 3:
          chosenSource = sources[3].multiembedvip[1].replace(
            "ID&tmdb=1&s=sea&e=epi",
            `${id}&tmdb=1&s=${sea}&e=${epi}`
          );
          break;
        case 4:
          chosenSource = sources[4].vidsrc[1].replace(
            "ID/sea/epi",
            `${id}/${sea}/${epi}`
          );
          break;
        case 5:
          chosenSource = sources[5].moviesapi[1].replace(
            "ID-sea-epi",
            `${id}-${sea}-${epi}`
          );
          break;
        case 6:
          chosenSource = sources[6].remotestream[1].replace(
            "ID/sea/epi",
            `${id}/${sea}/${epi}`
          );
          break;
        default:
          chosenSource = sources[0].embedcc[1].replace(
            "ID&s=sea&e=epi",
            `${id}&s=${sea}&e=${epi}`
          );
          break;
      }
    } else {
      switch (index || 0) {
        case 0:
          chosenSource = sources[0].embedcc[0].replace("ID", id);
          break;
        case 1:
          chosenSource = sources[1].smashstream[0].replace("ID", id);
          break;
        case 2:
          chosenSource = sources[2].multiembed[0].replace("ID", id);
          break;
        case 3:
          chosenSource = sources[3].multiembedvip[0].replace("ID", id);
          break;
        case 4:
          chosenSource = sources[4].vidsrc[0].replace("ID", id);
          break;
        case 5:
          chosenSource = sources[5].moviesapi[0].replace("ID", id);
          break;
        case 6:
          chosenSource = sources[6].remotestream[0].replace("ID", id);
          break;
        default:
          chosenSource = sources[0].embedcc[0].replace("ID", id);
          break;
      }
    }
    setSelectedSource(chosenSource);
  };

  const handleSeasonChange = (event) => {
    const selectedSeasonNumber = parseInt(event.target.value, 10);
    setSelectedSeason(selectedSeasonNumber);
    setSelectedEpisode(1);
    if (mediaType === "tv") {
      router.push(`/player/${mediaType}/${id}/${selectedSeasonNumber}/1`);
    }
  };

  const handleEpisodeClick = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
    if (mediaType === "tv") {
      router.push(`/player/${mediaType}/${id}/${selectedSeason}/${episodeNumber}`);
    }
  };

  const handleButtonClick = (index) => {
    setSelectedSourceIndex(index);
  };

  useEffect(() => {
    makeSource();

    if (mediaDetails && typeof window !== "undefined") {
      // Save current playback info to localStorage
      const playbackInfo = {
        id,
        mediaType,
        poster_path: mediaDetails.poster_path
          ? "https://image.tmdb.org/t/p/w185" + mediaDetails.poster_path
          : "",
        backdrop_path: mediaDetails.backdrop_path
          ? "https://image.tmdb.org/t/p/w1280" + mediaDetails.backdrop_path
          : "",
        title: mediaDetails.name || mediaDetails.title,
        season: mediaType === "tv" ? selectedSeason : null,
        episode: mediaType === "tv" ? selectedEpisode : null,
        timestamp: new Date().getTime(),
      };

      try {
        let continueWatching = JSON.parse(
          localStorage.getItem("continue_watching") || "[]"
        );

        continueWatching = continueWatching.filter(
          (item) => !(item.id === id && item.mediaType === mediaType)
        );

        continueWatching.unshift(playbackInfo);

        if (continueWatching.length > 10) {
          continueWatching = continueWatching.slice(0, 10);
        }

        localStorage.setItem(
          "continue_watching",
          JSON.stringify(continueWatching)
        );
      } catch (e) {
        console.error("Failed to save to continue_watching:", e);
      }
    }
  }, [selectedSourceIndex, selectedEpisode, selectedSeason, mediaDetails]);

  return (
    <div className="player">
      <div className="backdrop1-img">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <Img src={backdrop_path} />
        )}
      </div>

      {mediaType === "tv" ? (
        <div className="content-wrapper tv-layout">
          <div className="left-column">
            <iframe
              id="dd"
              src={selectedSource}
              frameBorder="0"
              scrolling="yes"
              allowFullScreen
            ></iframe>

            <div className="source-buttons">
              <select
                className="source-dropdown"
                onChange={(e) => handleButtonClick(parseInt(e.target.value, 10))}
                value={selectedSourceIndex}
              >
                {sources.map((source, index) => (
                  <option key={index} value={index}>
                    Source {index + 1}
                  </option>
                ))}
              </select>

              <div className="source-grid">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    onClick={() => handleButtonClick(index)}
                    className={
                      selectedSourceIndex === index
                        ? "source-btn-active button-62"
                        : "button-62"
                    }
                  >
                    Source {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-column">
            <div id="seasons">
              <select
                id="seasonsDropdown"
                onChange={handleSeasonChange}
                value={selectedSeason || ""}
              >
                {seasonsData.map((season) => (
                  <option
                    className="season-option"
                    key={season.id}
                    value={season.season_number}
                  >
                    {season.name}
                  </option>
                ))}
              </select>

              {selectedSeason !== null && (
                <div className="episode-container-anime">
                  {Array.from(
                    { length: seasonsData[selectedSeason - 1]?.episode_count || 0 },
                    (_, index) => index + 1
                  ).map((episodeNumber) => (
                    <div
                      className={
                        selectedEpisode === episodeNumber
                          ? "episode-div-active episode-div"
                          : "episode-div"
                      }
                      key={episodeNumber}
                      onClick={() => handleEpisodeClick(episodeNumber)}
                    >
                      S{selectedSeason} E{episodeNumber}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="content-wrapper movie-layout">
          <iframe
            id="dd"
            src={selectedSource}
            frameBorder="0"
            scrolling="yes"
            allowFullScreen
          ></iframe>

          <div className="source-buttons">
            <select
              className="source-dropdown"
              onChange={(e) => handleButtonClick(parseInt(e.target.value, 10))}
              value={selectedSourceIndex}
            >
              {sources.map((source, index) => (
                <option key={index} value={index}>
                  Source {index + 1}
                </option>
              ))}
            </select>

            <div className="source-grid">
              {sources.map((source, index) => (
                <div
                  key={index}
                  onClick={() => handleButtonClick(index)}
                  className={
                    selectedSourceIndex === index
                      ? "source-btn-active button-62"
                      : "button-62"
                  }
                >
                  Source {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
