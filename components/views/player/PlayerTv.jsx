"use client";

import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import "./style.scss";
import oridata from "@/assets/keys.json";
import "shaka-player/dist/controls.css";

const PlayerTv = ({ params: propParams }) => {
  const videoComponent = useRef(null);
  const videoContainer = useRef(null);
  const routeParams = useParams();
  const id = propParams?.id || routeParams?.id;
  const data = oridata.find((item) => item.channel_id == id);

  useEffect(() => {
    if (!data || typeof window === "undefined") return;

    let player = null;

    const initShaka = async () => {
      try {
        const shakaModule = await import("shaka-player/dist/shaka-player.ui.js");
        const shaka = shakaModule.default || shakaModule;

        const manifestUri = data.channel_url;
        const video = videoComponent.current;
        const container = videoContainer.current;

        if (!video || !container) return;

        player = new shaka.Player(video);
        const keys = data.key?.[0]?.split(":") || [];
        const clearKeysObject = {};
        if (keys[0] && keys[1]) {
          clearKeysObject[keys[0]] = keys[1];
        }

        player.configure({
          drm: {
            clearKeys: clearKeysObject,
          },
        });

        const uiConfig = {
          enableTooltips: true,
          controlPanelElements: [
            "play_pause",
            "mute",
            "volume",
            "fullscreen",
            "overflow_menu",
            "captions",
          ],
        };

        const ui = new shaka.ui.Overlay(player, container, video);
        ui.configure(uiConfig);
        ui.getControls();

        const onError = (error) => {
          console.error("Shaka error code", error?.code, "object", error);
        };

        player.addEventListener("error", (event) => onError(event.detail));

        await player.load(manifestUri);
      } catch (err) {
        console.error("Failed to load shaka player:", err);
      }
    };

    initShaka();

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [data]);

  if (!data) {
    return (
      <div id="player1">
        <div style={{ color: "#fff", textAlign: "center", padding: "100px 20px" }}>
          Live TV channel not found.
        </div>
      </div>
    );
  }

  const posterUrl = data.channel_logo?.includes("https://ltsk-cdn.s3")
    ? "https://mediaready.videoready.tv/tatasky-epg/image/fetch/f_auto,fl_lossy,q_auto,dpr_6.75,w_80/" +
      data.channel_logo
    : data.channel_logo;

  return (
    <div id="player1">
      <div className="video-container" id="ddplayer" ref={videoContainer}>
        <video
          autoPlay
          className="shaka-video"
          ref={videoComponent}
          poster={posterUrl}
        />
      </div>
    </div>
  );
};

export default PlayerTv;
