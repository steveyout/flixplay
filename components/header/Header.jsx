"use client";

import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useRouter, usePathname } from "next/navigation";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import { getDomainConfig } from "../../utils/seo";

const Header = ({ initialDomainConfig }) => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [brandName, setBrandName] = useState(
        initialDomainConfig?.brandName || "Netmirror"
    );
    const [brandLogo, setBrandLogo] = useState(
        initialDomainConfig?.faviconSvg || "/favicon-netmirror.svg"
    );

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cfg = getDomainConfig(window.location.hostname);
            setBrandName(cfg.brandName);
            setBrandLogo(cfg.faviconSvg || cfg.faviconPng);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    const controlNavbar = () => {
        if (typeof window === "undefined") return;
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY, mobileMenu]);

    const searchQueryHandler = () => {
        if (query.trim().length > 0) {
            router.push(`/search/${encodeURIComponent(query.trim())}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 100);
        }
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationHandler = (type) => {
        if (type === "movie") {
            router.push("/explore/movie");
        } else if (type === "tv") {
            router.push("/explore/tv");
        } else if (type === "anime") {
            router.push("/explore/anime");
        } else {
            router.push("/explore/livetv");
        }
        setMobileMenu(false);
    };

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
                    <img src={brandLogo} alt={brandName} />
                    <h1>{brandName}</h1>
                </div>
                <ul className="menuItems">
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("movie")}
                    >
                        Movies
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("tv")}
                    >
                        TV Shows
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("anime")}
                    >
                        Anime
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("livetv")}
                    >
                        Live TV
                    </li>
                    <li className="menuItem">
                        <HiOutlineSearch onClick={openSearch} />
                    </li>
                </ul>

                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} />
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                    )}
                </div>
            </ContentWrapper>
            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <div className="searchInput">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search for a movie or tv show...."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        searchQueryHandler();
                                    }
                                }}
                            />
                            <VscChromeClose onClick={() => setShowSearch(false)} />
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;
