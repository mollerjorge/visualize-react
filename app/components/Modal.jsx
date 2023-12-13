import React from "react";

import mixpanel from "mixpanel-browser";

import { Dialog, Transition } from "@headlessui/react";
import interviewBg from "../images/interview-bg.webp";
import questionsCover from "../images/questions-cover.webp";
import Button from "./Button";

const Modal = ({ isOpen, setIsOpen }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50 ">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <div className=" fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-cover mx-auto max-w-sm p-10 rounded-xl bg-slate-800 relative overflow-hidden min-w-[500px] min-h-[500px] flex flex-col">
              <img
                src={interviewBg}
                alt="bg interview"
                className="absolute w-[120%] -left-1 top-[200px] opacity-40"
              />
              <Dialog.Title>
                <h1 className="text-3xl text-center text-white font-bold">
                  I don&apos;t want you to leave empty handed 😊
                </h1>
              </Dialog.Title>

              <p className="text-white max-w-lg text-center mt-5">
                Ace your next interview with these 30+ questions and answers
                about React.
              </p>

              <img
                className="w-40 transition-all mx-auto mt-10 transform hover:-translate-y-2 hover:-rotate-2"
                src={questionsCover}
                alt="book cover"
              />

              <Button
                onClick={() => {
                  mixpanel.track("Click", {
                    navbar: "Download 30 Interview Questions and Answers",
                  });
                }}
                href="react-interview-questions-and-answers.pdf"
                primary
                cn="mx-auto w-fit !mt-10"
              >
                Download now
              </Button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
