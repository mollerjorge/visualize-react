import React from "react";

import starsBg from "../images/stars-bg.webp";

export default function Bonus() {
  const isScrolledIntoView = (el) => {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    // Only completely visible elements return true:
    var isVisible = elemTop > 400 && elemTop < 500
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  };

  const onScroll = () => {
    const video = document.getElementById("bonus-video");
    const isInView = isScrolledIntoView(video);
    if (isInView && window.innerWidth > 1024) {
      video.play();
    }
  };

  React.useEffect(() => {
    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="py-20 bg-body-1 relative">
      <img
        src={starsBg}
        alt="stars background"
        className="absolute w-1/4 -top-40"
      />
      <div className="max-w-7xl mx-auto flex items-center flex-col overflow-hidden">
        <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium">
          Bonus Gift
        </div>

        <h2 className="text-[40px] max-w-lg text-center leading-tight font-bold">
          React Interview Questions & Answers ebook
        </h2>
        <p className="text-lg max-w-2xl mb-20 text-center">
          You'll also get the React interview ebook so that you can ace your
          next interview by learning how to answer the top most asked React
          questions.
        </p>

        <div className="w-fit  bg-[#D9D9D9] max-w-4xl bg-opacity-10 relative p-10 mx-auto rounded-[42px]">
          <video controls id="bonus-video" className="w-full mx-auto " muted loop>
            <source
              src="./interview-challenges-book.m4v"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
