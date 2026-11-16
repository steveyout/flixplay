"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./style.scss";

const CircleRating = ({ rating }) => {
    return (
        <div className="circleRating">
            <CircularProgressbar
                value={Number(rating) || 0}
                maxValue={10}
                text={String(rating ?? "0.0")}
                styles={buildStyles({
                    pathColor:
                        Number(rating) < 5 ? "red" : Number(rating) < 7 ? "orange" : "green",
                })}
            />
        </div>
    );
};

export default CircleRating;
