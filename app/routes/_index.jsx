import React from "react";

import { Analytics } from '@vercel/analytics/react';

import { Hero } from "../components/Hero";
import { Header } from "../components/Header";
import TheProblem from "../components/TheProblem";
import WhatIsInside from "../components/WhatIsInside";
import Why from "../components/Why";
import WhatPeopleSay from "../components/WhatPeopleSay";
import Pricing from "../components/Pricing";
import Bonus from "../components/Bonus";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";

import mixpanel from "mixpanel-browser";

mixpanel.init("fa22af7fecb1e5b8d0c88bd7111c0c63", {
  debug: false,
  track_pageview: false,
  persistence: "localStorage",
});

export const meta = () => {
  return [
    { title: "Master React - Finally Understand the WHY Behind React Patterns" },
    { name: "description", content: "107 visual infographics + 77 video tutorials that explain the WHY behind React patterns. Stop copying Stack Overflow. Start writing code you're proud of." },
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
        {/* 1. Hero with social proof */}
        <Hero />

        {/* 2. Problem-Agitate-Solution */}
        <TheProblem />

        {/* 3. What's Inside (videos + infographics) */}
        <WhatIsInside />

        {/* 4. Social Proof */}
        <WhatPeopleSay />

        {/* 5. About George (credibility) */}
        <Why />

        {/* 6. Bonus Gift */}
        <Bonus />

        {/* 7. Pricing with guarantee */}
        <Pricing />

        {/* 8. FAQ section */}
        <FAQ />

        {/* 9. Final CTA */}
        <FinalCTA />

        <Footer />
        <Modal isOpen={isOpen} setIsOpen={setIsModalOpen} />
        <Analytics />
        <script src="https://cdn.paritydeals.com/banner.js" async />
      </main>
    </>
  );
}
