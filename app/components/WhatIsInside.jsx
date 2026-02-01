import React from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Video from "yet-another-react-lightbox/plugins/video";

import info1 from "../images/infographics/info-1.webp";
import info2 from "../images/infographics/info-2.webp";
import info3 from "../images/infographics/info-3.webp";
import info4 from "../images/infographics/info-4.webp";
import info5 from "../images/infographics/info-5.webp";
import info6 from "../images/infographics/info-6.webp";

import video1cover from "../images/videos/video-1-cover.webp";
import video2cover from "../images/videos/video-2-cover.webp";
import video3cover from "../images/videos/video-3-cover.webp";
import video4cover from "../images/videos/video-4-cover.webp";
import video5cover from "../images/videos/video-5-cover.webp";
import video6cover from "../images/videos/video-6-cover.webp";

import magnifyGlass from "../images/magnify-glass.svg";
import play from "../images/play.svg";
import starsBg from "../images/stars-bg.webp";
import useOnScreen from "../hooks/useOnScreen";
import { animated, useTrail, config } from "@react-spring/web";

const infographics = [
  {
    src: info1,
    alt: "infographic explaining difference between useEffect and useLayout effect",
  },
  {
    src: info2,
    alt: "infographic explaining how to structure a react project",
  },
  {
    src: info3,
    alt: "infographic explaining difference between useMemo and useCallback",
  },
  {
    src: info4,
    alt: "infographic explaining how to listen for ref changes in React",
  },
  {
    src: info5,
    alt: "infographic explaining how to properly use useCallback hook",
  },
  {
    src: info6,
    alt: "infographic explaining the React render process",
  },
];

const videos = [
  {
    type: "video",
    width: 1280,
    height: 720,
    autoPlay: true,
    bic: 1,
    alt: "How to conditionally render views in React?",
    poster: video1cover,
    sources: [
      {
        src: "./conditional rendering enums.m4v",
        type: "video/mp4",
      },
    ],
  },
  {
    type: "video",
    width: 1280,
    height: 720,
    autoPlay: true,
    bic: 2,
    alt: "Absolute imports in React",
    poster: video2cover,
    sources: [
      {
        src: "absolute imports.m4v",
        type: "video/mp4",
      },
    ],
  },
  {
    type: "video",
    width: 1280,
    height: 720,
    autoPlay: true,
    bic: 3,
    alt: "How to avoid provider hell in React",
    poster: video3cover,
    sources: [
      {
        src: "./avoid provider wrapping hell.m4v",
        type: "video/mp4",
      },
    ],
  },
  {
    type: "video",
    width: 1280,
    height: 720,
    autoPlay: true,
    bic: 4,
    alt: "Don't sync state in useEffect",
    poster: video4cover,
    sources: [
      {
        src: "./avoid syncing state in useeffect.m4v",
        type: "video/mp4",
      },
    ],
  },
  {
    type: "video",
    width: 1280,
    height: 720,
    autoPlay: true,
    bic: 5,
    alt: "Embrace composition",
    poster: video5cover,
    sources: [
      {
        src: "./embrace composition.m4v",
        type: "video/mp4",
      },
    ],
  },
  {
    type: "video",
    width: 1280,
    height: 720,
    autoPlay: true,
    bic: 6,
    alt: "How to use the factory pattern in React?",
    poster: video6cover,
    sources: [
      {
        src: "./factory pattern.m4v",
        type: "video/mp4",
      },
    ],
  },
];

export default function WhatIsInside() {
  const [openVideo, setOpenVideo] = React.useState(false);
  const [videoIndex, setVideoIndex] = React.useState(0);
  const [infoIndex, setInfoIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const whatIsInsideref = React.useRef();
  const infosRef = React.useRef();
  const isInView = useOnScreen(whatIsInsideref);
  const isInViewInfos = useOnScreen(infosRef);

  const [trail, api] = useTrail(
    6,
    () => ({
      from: { opacity: 0, y: -200 },
    }),
    []
  );
  const [trailInfos, apiInfos] = useTrail(
    6,
    () => ({
      from: { opacity: 0, y: -200 },
    }),
    []
  );

  React.useEffect(() => {
    if (isInView) {
      api.start({
        to: { opacity: 1, y: 0 },
        config: config.stiff,
      });
    }
  }, [isInView]);

  React.useEffect(() => {
    if (isInViewInfos) {
      apiInfos.start({
        to: { opacity: 1, y: 0 },
        config: config.stiff,
      });
    }
  }, [isInViewInfos]);

  return (
    <div id="what-is-inside" className="relative">
      <img
        src={starsBg}
        alt="stars background"
        className="absolute w-1/4 -top-40"
      />
      <div className="max-w-7xl mx-auto ">
        <div className="flex pt-5 mx-auto max-w-4xl items-center  flex-col mt-40">
          <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium mx-auto">
            What's inside?
          </div>

          <div className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full mb-4">
            WEEKLY UPDATES
          </div>
          <h2 className="text-[40px] text-center font-bold">
            The Video Tutorials
          </h2>
          <p className="mt-5 text-lg font-medium max-w-xl text-center">
            77 video tutorials that will guide you through practical, real-world
            scenarios in React development.
          </p>
        </div>
        <div className="mx-10">
          <div
            className="top-[400px] absolute z-10 w-full"
            ref={whatIsInsideref}
          />
          <ul className="grid grid-cols-1 relative md:grid-cols-2 gap-x-20 gap-y-16 mt-20">
            {trail.map((style, index) => {
              const video = videos[index];
              return (
                <animated.li
                  style={style}
                  key={video.alt}
                  className="group relative cursor-pointer "
                  onClick={() => {
                    setVideoIndex(index);
                    setOpenVideo(true);
                  }}
                >
                  <div className="bg-black bg-opacity-40 transition-all group-hover:opacity-100 opacity-0 inset-0 absolute flex items-center justify-center">
                    <img src={play} alt="play video icon" className="w-12" />
                  </div>
                  <img
                    src={video?.poster}
                    alt={video?.alt}
                    className="w-full rounded-2xl"
                  />
                </animated.li>
              );
            })}
          </ul>

          <p className="text-center text-2xl font-medium mt-20 italic">
            ...71 more videos
          </p>
        </div>

        <Lightbox
          plugins={[Video]}
          index={videoIndex}
          open={openVideo}
          close={() => setOpenVideo(false)}
          slides={videos}
        />
      </div>

      <div className="max-w-7xl mx-auto ">
        <div className="flex pt-5 mx-auto max-w-4xl items-center  flex-col mt-40">
          <h2 className="text-[40px] text-center font-bold">
            The Infographpics
          </h2>
          <p className="mt-5 text-lg font-medium max-w-xl text-center">
            A beautiful PDF containing 107 incredibly visual infographics.
          </p>
        </div>

        <div className="mx-10 relative">
          <div className="top-[300px] absolute z-10 w-full" ref={infosRef} />
          <ul className="grid grid-cols-1 relative md:grid-cols-2 gap-x-20 gap-y-16 mt-20">
            {trailInfos.map((style, index) => {
              const info = infographics[index];

              return (
                <animated.li
                  key={index}
                  style={style}
                  className="group relative cursor-pointer "
                  onClick={() => {
                    setOpen(true);
                    setInfoIndex(index);
                  }}
                >
                  <div className="bg-black bg-opacity-40 transition-all group-hover:opacity-100 opacity-0 inset-0 absolute flex items-center justify-center">
                    <img
                      src={magnifyGlass}
                      alt="magnifying glass icon"
                      className="w-12"
                    />
                  </div>
                  <img
                    src={info.src}
                    alt={info.alt}
                    className="w-full rounded-2xl"
                  />
                </animated.li>
              );
            })}
          </ul>

          <p className="text-center text-2xl font-medium mt-20 mb-20 italic">
            ...101 more infographics
          </p>
        </div>
        <Lightbox
          index={infoIndex}
          open={open}
          close={() => setOpen(false)}
          slides={[
            { src: info1 },
            { src: info2 },
            { src: info3 },
            { src: info4 },
            { src: info5 },
            { src: info6 },
          ]}
        />
      </div>
    </div>
  );
}
