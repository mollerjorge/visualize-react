import { Fragment } from "react";
import { Link, NavLink } from "@remix-run/react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";

import logo from "../images/logo.png";
import { Container } from "./Container";
import Button from "./Button";
// import { NavLink } from '@/components/NavLink'

function MobileNavLink({ href, children }) {
  return (
    <Popover.Button href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

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
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
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
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/login">Sign in</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  return (
    <header className="py-10 text-white">
      <Container>
        <nav className="relative z-50 flex items-center justify-between">
          <Link href="#" aria-label="Home">
            <img src={logo} className="w-14 h-14" alt="visualize react logo" />
          </Link>

          <div className="hidden text-slate-300 xl:flex md:gap-10 text-lg font-semibold xl:ml-40 ">
            <NavLink className="hover:text-white" href="#overview">
              Overview
            </NavLink>
            <NavLink className="hover:text-white" href="#what-is-inside">
              What's inside?
            </NavLink>
            <NavLink className="hover:text-white" href="#testimonials">
              Testimonials
            </NavLink>
            <NavLink className="hover:text-white" href="#pricing">
              Pricing
            </NavLink>
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <Button primary>Get it now</Button>
            </div>
            <MobileNavigation />
          </div>
        </nav>
      </Container>
    </header>
  );
}
