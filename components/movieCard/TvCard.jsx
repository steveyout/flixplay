"use client";

import React from "react";
import { useRouter } from "next/navigation";

import "./style.scss";
import Img from "../lazyLoadImage/Img";

const TvCard = ({ data }) => {
  const router = useRouter();
  const logoUrl = data.channel_logo?.includes("https://ltsk-cdn.s3")
    ? "https://mediaready.videoready.tv/tatasky-epg/image/fetch/f_auto,fl_lossy,q_auto,dpr_6.75,w_40/" +
      data.channel_logo
    : data.channel_logo;

  return (
    <div
      className="tvCard"
      onClick={() => router.push("/player/livetv/" + data.channel_id)}
      style={{ cursor: "pointer" }}
    >
      <div className="posterBlock">
        <Img
          className="posterImg"
          src={logoUrl}
        />
      </div>
      <div className="textBlock">
        <span className="title">{data.channel_name}</span>
      </div>
    </div>
  );
};

export default TvCard;
