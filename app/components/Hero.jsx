import Button from "./Button";

import stars from "../images/stars.png";
import star1 from "../images/star-1.svg";
import star2 from "../images/star-2.svg";

export function Hero() {
  return (
    <>
      <div className="flex pt-5 mx-auto max-w-4xl justify-center items-start md:justify-between">
        <div className="flex flex-col items-center gap-2">
          <img src={stars} className="w-28" alt="stars" />
          <p className="text-white font-semibold text-opacity-60 text-base">
            These infographics & videos are 🔥
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2">
          <img src={stars} className="w-28" alt="stars" />
          <p className="text-white font-semibold text-opacity-60 text-base">
            Finally understood useEffect
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2">
          <img src={stars} className="w-28" alt="stars" />
          <p className="text-white font-semibold max-w-[250px] text-center text-opacity-60 text-base">
            A lot of tips I haven't found elsewhere
          </p>
        </div>
      </div>
      <div className="pb-16 pt-20 text-center lg:pt-24">
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
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Become{" "}
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
                  stroke-width="2"
                  stroke-linecap="round"
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
                    <stop stop-color="#C084FC" />
                    <stop offset="1" stop-color="#C084FC" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              the best
            </span>
          </span>{" "}
          React developer at your company.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-100 font-medium">
          100+ expertly crafted infographics and 70+ dynamic video tutorials
          will take you from enthusiast to React professional. Start mastering
          React now!.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button primary>Get it now</Button>
        </div>
        <div className="mt-10 lg:mt-20 p-5 ">
          <div className="mx-auto ">
            <div className="w-fit before:absolute before:w-full before:bg-red-500 bg-[#D9D9D9] bg-opacity-10 relative p-10 mx-auto rounded-[42px]">
              <iframe
                className="mx-auto"
                width="880"
                height="457"
                src="https://www.youtube.com/embed/oUFJJNQGwhk?si=tIU5E7G-woFkOU0z"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
