import { Fragment } from "react";
import { track } from "@vercel/analytics";
import { Link } from "@remix-run/react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import mixpanel from "mixpanel-browser";

import logo from "../images/logo.webp";
import { Container } from "./Container";
import Button from "./Button";

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-200"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative xl:hidden z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-slate-800 p-4 text-lg tracking-tight text-white shadow-xl ring-1 ring-slate-900/5"
          >
            <Link className="hover:text-white text-center mb-2" to="#overview"
              onClick={() => {
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'mobile_menu',
                    link_text: 'Overview',
                    link_destination: '#overview'
                  });
                }
              }}
            >
              Overview
            </Link>
            <Link
              className="hover:text-white text-center mb-2"
              to="#what-is-inside"
              onClick={() => {
                track("Click", { name: "What's inside" });
                mixpanel.track("Click", {
                  navbar: "What is inside",
                });
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'mobile_menu',
                    link_text: "What's inside?",
                    link_destination: '#what-is-inside'
                  });
                }
              }}
            >
              What's inside?
            </Link>
            <Link
              className="hover:text-white text-center mb-2"
              to="#testimonials"
              onClick={() => {
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'mobile_menu',
                    link_text: 'Testimonials',
                    link_destination: '#testimonials'
                  });
                }
              }}
            >
              Testimonials
            </Link>
            <Link className="hover:text-white text-center mb-2" to="#pricing"
              onClick={() => {
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'mobile_menu',
                    link_text: 'Pricing',
                    link_destination: '#pricing'
                  });
                }
              }}
            >
              Pricing
            </Link>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  return (
    <header
      className="py-5 text-white sticky top-0 bg-body-1 z-50 bg-opacity-60 "
      style={{ backdropFilter: "blur(5px)" }}
    >
      <Container>
        <nav className="relative z-50 flex items-center justify-between">
          <Link href="#" aria-label="Home">
            <img src={logo} className="w-14 h-14" alt="visualize react logo" />
          </Link>

          <div className="hidden text-slate-300 xl:flex md:gap-10 text-lg font-semibold xl:ml-40 ">
            <Link
              onClick={() => {
                track("Click", { name: "Overview" });
                mixpanel.track("Click", {
                  navbar: "Overview",
                });
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'header',
                    link_text: 'Overview',
                    link_destination: '#overview'
                  });
                }
              }}
              className="hover:text-white"
              to="#overview"
            >
              Overview
            </Link>
            <Link
              onClick={() => {
                track("Click", { name: "What's inside" });
                mixpanel.track("Click", {
                  navbar: "What is inside",
                });
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'header',
                    link_text: "What's inside?",
                    link_destination: '#what-is-inside'
                  });
                }
              }}
              className="hover:text-white"
              to="#what-is-inside"
            >
              What's inside?
            </Link>
            <Link
              onClick={() => {
                track("Click", { name: "Testimonials" });
                mixpanel.track("Click", {
                  navbar: "Testimonials",
                });
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'header',
                    link_text: 'Testimonials',
                    link_destination: '#testimonials'
                  });
                }
              }}
              className="hover:text-white"
              to="#testimonials"
            >
              Testimonials
            </Link>
            <Link
              onClick={() => {
                track("Click", { name: "Pricing" });
                mixpanel.track("Click", {
                  navbar: "Pricing",
                });
                if (typeof window !== 'undefined' && window.op) {
                  window.op('track', 'nav_link_clicked', {
                    location: 'header',
                    link_text: 'Pricing',
                    link_destination: '#pricing'
                  });
                }
              }}
              className="hover:text-white"
              to="#pricing"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <Button
                onClick={() => {
                  track("Get it now", { name: "navbar" });
                  mixpanel.track("Click", {
                    "Get it now": "navbar",
                  });
                  if (typeof window !== 'undefined' && window.op) {
                    window.op('track', 'cta_clicked', {
                      button_text: 'Get it now',
                      location: 'header',
                      cta_type: 'primary',
                      link_destination: '#pricing'
                    });
                  }
                }}
                to="#pricing"
                primary
              >
                Get it now
              </Button>
            </div>
            <MobileNavigation />
          </div>
        </nav>
      </Container>
    </header>
  );
}
