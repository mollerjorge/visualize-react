import TestimonialCard from "../components/TestimonialCard";
import mixpanel from "mixpanel-browser";

import profile1 from "../images/profiles/profile-1.webp";
import profile2 from "../images/profiles/profile-2.webp";
import profile3 from "../images/profiles/profile-3.webp";
import profile4 from "../images/profiles/profile-4.webp";
import profile5 from "../images/profiles/profile-5.webp";

import testimonial2 from "../images/testimonials/kate.jpg";
import testimonial3 from "../images/testimonials/lucas.png";
import testimonial4 from "../images/testimonials/pete.jpg";
import testimonial5 from "../images/testimonials/pratham.jpeg";
import testimonial6 from "../images/testimonials/sophie.jpg";
import testimonial7 from "../images/testimonials/soham.jpeg";
import testimonial8 from "../images/testimonials/mike.webp";

import star from "../images/stars-2.png";
import Button from "./Button";

const testimonials = [
  {
    name: "Kate",
    occupation: "Frontend Developer",
    text: (
      <div className="text-white max-w-sm  whitespace-break-spaces mb-5 ">
        <p className="mb-5">
          How to structure and organize a React application was always a
          struggle for me.
        </p>
        <p>
          George explains a nice and easy path to follow to achieve a
          maintainable app structure, and now it makes compelte sense!
        </p>
      </div>
    ),
    photoUrl: testimonial2,
  },
  {
    name: "Pratham",
    occupation: "Software Engineer and Developer Relations at HyperspaceAI",
    text: (
      <div className="text-white max-w-sm  whitespace-break-spaces mb-5 ">
        <p className="mb-5">
          I like how easily you explain things using only infographics.
        </p>
        <p> Quality content 🔥</p>
      </div>
    ),
    photoUrl: testimonial5,
  },
  {
    name: "Lucas",
    occupation: "Frontend Engineer",
    text: (
      <div className="text-white max-w-sm  whitespace-break-spaces mb-5 ">
        <p className="mb-5">It’s so pleasing to read your infographics.</p>
        <p> Clear and straightforward and the content is awesome.</p>
      </div>
    ),
    photoUrl: testimonial3,
  },
  {
    name: "Soham",
    occupation: "Full stack web developer",
    text: (
      <div className="text-white max-w-sm  whitespace-break-spaces mb-5 ">
        <p className="mb-5">
          Thank you for sharing this valuable resource, George!
        </p>
        <p className="mb-5">
          As a React developer, I am always looking for ways to improve my
          skills and these infographics are a great tool for enhancing my
          knowledge.
        </p>
        <p>Can't wait to download and start learning!</p>
      </div>
    ),
    photoUrl: testimonial7,
  },
  {
    name: "Sophie",
    occupation: "Software Engineer",
    text: (
      <div className="text-white max-w-sm  whitespace-break-spaces mb-5 ">
        <p className="mb-5">
          The visual presentation of concepts is top-notch, specially the ones
          related to useEffect.
        </p>
        <p className="mb-5">
          After a couple of hours going through them I already feel more
          confident with React.
        </p>
        <p>Thanks George!</p>
      </div>
    ),
    photoUrl: testimonial6,
  },
  {
    name: "Pete",
    occupation: "Web developer at Pixels",
    text: (
      <div className="text-white max-w-sm  whitespace-break-spaces mb-5 ">
        <p className="mb-5">
          I never undestood how and when to use useEffect in React
        </p>
        <p>
          After reading these infographics, I'll have to refactor some old cold
          😅.
        </p>
      </div>
    ),
    photoUrl: testimonial4,
  },
  {
    name: "Mike",
    occupation: "Software Engineer at Hubspot",
    text: (
      <div className="text-white max-w-sm  whitespace-break-spaces mb-5 ">
        <p className="mb-5">
          I want to take the time to thank you again. The infographics and
          videos are helping tremendously.
        </p>
        <p className="mb-5">
          I'm constantly searching for the best way to learn and retain
          information.
        </p>
        <p>
          So far your teaching style is most suitable for my ADHD. Much
          appreciated
        </p>
      </div>
    ),
    photoUrl: testimonial8,
  },
];

export default function Testimonials() {
  return (
    <div className="px-5 bg-body-1 py-40 ">
      <div
        id="testimonials"
        className="max-w-7xl mx-auto flex items-start justify-start flex-col overflow-hidden"
      >
        <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium">
          Testimonials
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-10 md:gap-0 md:flex-row justify-between items-center w-full">
            <div className="flex flex-col">
              <h2 className="text-[40px] font-bold max-w-sm leading-tight">
                Here's what others have to say
              </h2>

              <div className="flex gap-4 items-center mt-5">
                <img
                  width={40}
                  height={40}
                  src={profile1}
                  className="border-white rounded-full aspect-square border-2"
                  alt="testimonial profile"
                />
                <img
                  width={40}
                  height={40}
                  src={profile2}
                  className="border-white rounded-full aspect-square border-2 -ml-6"
                  alt="testimonial profile"
                />
                <img
                  width={40}
                  height={40}
                  src={profile3}
                  className="border-white rounded-full aspect-square border-2 -ml-6"
                  alt="testimonial profile"
                />
                <img
                  width={40}
                  height={40}
                  src={profile4}
                  className="border-white rounded-full aspect-square border-2 -ml-6"
                  alt="testimonial profile"
                />
                <img
                  width={40}
                  height={40}
                  src={profile5}
                  className="border-white rounded-full aspect-square border-2 -ml-6"
                  alt="testimonial profile"
                />

                <div className="flex gap-1 flex-col">
                  <div className="flex gap-1">
                    <img src={star} alt="star icon" className="w-24" />
                  </div>
                  <p className="text-sm text-white">4.9/5 from 598 reviews</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                mixpanel.track("Click", {
                  "Get it now": "testimonials",
                });
              }}
              to="#pricing"
              primary
            >
              Get it now
            </Button>
          </div>
        </div>
        <div className="my-10" />
        <div className="slider">
          <div className="slide-track">
            {[...testimonials, ...testimonials].map((testimonial, index) => {
              return (
                <TestimonialCard
                  key={`${testimonial.name}-${index}`}
                  text={testimonial.text}
                  photoUrl={testimonial.photoUrl}
                  name={testimonial.name}
                  occupation={testimonial.occupation}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
