export default function WhatPeopleSay() {
  const images = [
    "/people-saying/Screenshot 2026-02-01 at 15.09.08.png",
    "/people-saying/Screenshot 2026-02-01 at 15.09.17.png",
    "/people-saying/Screenshot 2026-02-01 at 15.17.01.png",
    "/people-saying/Screenshot 2026-02-01 at 16.03.41.png",
    "/people-saying/Screenshot 2026-02-01 at 16.03.54.png",
    "/people-saying/Screenshot 2026-02-01 at 16.04.03.png",
  ];

  return (
    <div id="what-people-say" className="py-40 bg-body-1">
      <div className="max-w-7xl mx-auto px-5">
        <div className="max-w-max mx-auto bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium">
          Social Proof
        </div>

        <h2 className="text-[32px] md:text-[40px] text-center leading-tight font-bold mb-16">
          What people are saying
        </h2>
      </div>

      <div className="relative overflow-hidden group">
        {/* Gradient Overlay - Left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-body-1 to-transparent"></div>

        {/* Scrolling carousel */}
        <div className="flex w-max animate-marquee-slow group-hover:[animation-play-state:paused]">
          {[...images, ...images, ...images, ...images].map((src, idx) => (
            <img
              key={`img-${idx}`}
              src={src}
              alt="Customer feedback"
              className="h-[500px] w-auto mx-4 rounded-xl flex-shrink-0"
            />
          ))}
        </div>

        {/* Gradient Overlay - Right */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-body-1 to-transparent"></div>
      </div>
    </div>
  );
}
