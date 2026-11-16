"use client";

import React, { useState, useEffect } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
} from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import { getDomainConfig } from "../../utils/seo";

import "./style.scss";

const Footer = ({ initialDomainConfig }) => {
    const [brandName, setBrandName] = useState(
        initialDomainConfig?.brandName || "Netmirror"
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cfg = getDomainConfig(window.location.hostname);
            setBrandName(cfg.brandName);
        }
    }, []);

    return (
        <footer className="footer">
            <ContentWrapper>
                <ul className="menuItems">
                    <li className="menuItem">Terms Of Use</li>
                    <li className="menuItem">Privacy-Policy</li>
                    <li className="menuItem">About</li>
                    <li className="menuItem">Blog</li>
                    <li className="menuItem">FAQ</li>
                </ul>
                <div className="infoText">
                    {brandName} is a free streaming platform that allows you to watch movies,
                    web series, and TV shows online in HD quality. No registration or payment required.
                    Stream your favorite entertainment content smoothly from any device.
                </div>
                <div className="socialIcons">
                    <span className="icon">
                        <FaFacebookF />
                    </span>
                    <span className="icon">
                        <FaInstagram />
                    </span>
                    <span className="icon">
                        <FaTwitter />
                    </span>
                    <span className="icon">
                        <FaLinkedin />
                    </span>
                </div>
            </ContentWrapper>
        </footer>
    );
};

export default Footer;
