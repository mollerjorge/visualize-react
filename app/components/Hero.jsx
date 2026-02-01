import React from "react";
import { track } from "@vercel/analytics";

import { animated, useSpring, config } from "@react-spring/web";
import mixpanel from "mixpanel-browser";

import Button from "./Button";
import Marquee from "./Marquee";

import stars from "../images/stars.png";
import star1 from "../images/star-1.svg";
import star2 from "../images/star-2.svg";

export function Hero() {
  const styles = useSpring({
    from: {
      opacity: 0,
      y: "-20px",
    },
    to: {
      opacity: 1,
      y: "20px",
    },
    config: config.molasses,
  });
  const stylesHeading = useSpring({
    from: {
      opacity: 0,
      y: "-20px",
    },
    to: {
      opacity: 1,
      y: "20px",
    },
    config: config.molasses,
  });

  const isScrolledIntoView = (el) => {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  };

  const onScroll = () => {
    const video = document.getElementById("hero-video");
    const isInView = isScrolledIntoView(video);
    if (isInView && window.innerWidth > 1024) {
      video.play();
    }
  };

  React.useEffect(() => {
    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll)
    }
  }, []);

  React.useEffect(() => {
    const video = document.getElementById('hero-video');
    if (!video) return;

    const handlePlay = () => {
      if (typeof window !== 'undefined' && window.op) {
        window.op('track', 'video_played', {
          video_id: 'hero-video',
          video_title: 'Course intro',
          location: 'hero'
        });
      }
    };

    const handlePause = () => {
      if (typeof window !== 'undefined' && window.op) {
        window.op('track', 'video_paused', {
          video_id: 'hero-video',
          play_position: Math.round(video.currentTime),
          duration: Math.round(video.duration)
        });
      }
    };

    const handleEnded = () => {
      if (typeof window !== 'undefined' && window.op) {
        window.op('track', 'video_completed', {
          video_id: 'hero-video',
          duration: Math.round(video.duration)
        });
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <>
      <div
        style={styles}
        className="flex pt-5 mx-auto max-w-4xl justify-center items-start md:justify-between"
      >
        <div className="flex flex-col items-center gap-2">
          <img src={stars} className="w-28" alt="stars" />
          <p className="text-white font-semibold text-opacity-60 text-base">
            "No fluff, straight to the point."
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2">
          <img src={stars} className="w-28" alt="stars" />
          <p className="text-white max-w-xs text-center font-semibold text-opacity-60 text-base">
            "Best React content I've seen."
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2">
          <img src={stars} className="w-28" alt="stars" />
          <p className="text-white font-semibold max-w-[250px] text-center text-opacity-60 text-base">
            "Visual format is a game changer."
          </p>
        </div>
      </div>
      <div className="py-12 text-center">
        <img
          src={star1}
          className="-z-[1] absolute -top-20 sm:-left-20 sm:top-40"
          alt="star-1"
        />
        <img
          src={star2}
          className="-z-[1] absolute bottom-0 -left-40 sm:left-auto sm:right-20"
          alt="star-2"
        />
        <h1
          style={stylesHeading}
          className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          Master production ready{" "}
          <span className="relative whitespace-nowrap text-purple-2">
            <span className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="242"
                height="113"
                viewBox="0 0 242 113"
                fill="none"
                className="absolute w-[95%] -top-[22px] sm:-top-1 -left-1 -z-[1]"
              >
                <path
                  d="M5.22039 69.2556C7.89051 93.3575 55.6278 107.895 121.832 100.561C188.036 93.2264 239.54 67.7422 236.87 43.6403C234.2 19.5384 178.367 5.94568 112.163 13.2801C95.5084 15.1251 79.7844 18.1186 65.6191 21.9498"
                  stroke="url(#paint0_linear_1784_83)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="117.5" cy="12.399" r="5.5" fill="#8D64BC" />
                <defs>
                  <linearGradient
                    id="paint0_linear_1784_83"
                    x1="8.01136"
                    y1="35.3667"
                    x2="216.814"
                    y2="104.387"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#C084FC" />
                    <stop offset="1" stopColor="#C084FC" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              React
            </span>
          </span>{" "}
          patterns.
        </h1>
        <p
          style={stylesHeading}
          className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-100 font-medium"
        >
          The visual learning experience for developers who want to truly understand React, no filler content. +107 visual infographics. +77 hands-on short video lessons.
        </p>
        <div
          style={stylesHeading}
          className="mt-10 flex justify-center gap-x-6"
        >
          <Button
            onClick={() => {
              track("Enroll Now", { name: "Hero" });
              mixpanel.track("Click", {
                "Enroll Now": "hero",
              });
              if (typeof window !== 'undefined' && window.op) {
                window.op('track', 'cta_clicked', {
                  button_text: 'Enroll Now',
                  location: 'hero',
                  cta_type: 'primary',
                  link_destination: '#pricing'
                });
              }
            }}
            to="#pricing"
            primary
          >
            Enroll Now
          </Button>
        </div>
        <div className="mt-16">
          <p className="text-sm text-center font-medium text-slate-400 mb-4">Users include engineers from:</p>
          <Marquee />
        </div>
        <div className="mt-10 lg:mt-20 p-5 ">
          <div className="mx-auto ">
            <div className="w-fit before:absolute before:w-full  bg-[#D9D9D9] bg-opacity-10 relative p-5 md:p-10 mx-auto rounded-[42px]">
              <video
                id="hero-video"
                className="mx-auto w-full h-[187px] sm:w-[440px] sm:h-[234px] lg:w-[880px] lg:h-[457px]"
                src="./intro.mp4"
                controls
                muted
                preload="none"
              >
                <track src="https://res.cloudinary.com/dptgkdbjg/raw/upload/v1701792511/subs_en_rok8yu.vtt" kind="captions" srcLang="en" label="english_captions" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
