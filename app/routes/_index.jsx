import React, { useState } from "react";

import { Hero } from "../components/Hero";
import { Header } from "../components/Header";
import TheProblem from "../components/TheProblem";
import WhatIsInside from "../components/WhatIsInside";
import Why from "../components/Why";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Bonus from "../components/Bonus";
import Footer from "../components/Footer";
import Modal from "../components/Modal";

import mixpanel from "mixpanel-browser";

mixpanel.init("fa22af7fecb1e5b8d0c88bd7111c0c63", {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [isOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener("mouseleave", function (event) {
      if (
        event.clientY <= 0 ||
        event.clientX <= 0 ||
        event.clientX >= window.innerWidth ||
        event.clientY >= window.innerHeight
      ) {
        setIsModalOpen(true);
      }
    });
  }, []);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TheProblem />
        <WhatIsInside />
        <Why />
        <Testimonials />
        <Bonus />
        <Pricing />
        <Footer />
        {/* <Modal isOpen={isOpen} setIsOpen={setIsModalOpen} /> */}
      </main>
    </>
  );
}
