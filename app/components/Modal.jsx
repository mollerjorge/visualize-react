import React from "react";
import { track } from "@vercel/analytics";

import mixpanel from "mixpanel-browser";

import { Dialog, Transition } from "@headlessui/react";
import interviewBg from "../images/interview-bg.webp";
import questionsCover from "../images/questions-cover.webp";

const Modal = ({ isOpen, setIsOpen }) => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const formUrl =
    "https://georgemoller.lemonsqueezy.com/email-subscribe/external";
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
                className="w-52 transition-all mx-auto mt-10 transform hover:-translate-y-2 hover:-rotate-2"
                src={questionsCover}
                alt="book cover"
              />

              <form
                className="z-10"
                onSubmit={async (e) => {
                  e.preventDefault();
                  track("Click", {
                    name: "Download 30 Interview Questions and Answers",
                  });
                  mixpanel.track("Click", {
                    navbar: "Download 30 Interview Questions and Answers",
                  });
                  setLoading(true);

                  try {
                    let response = await fetch(formUrl, {
                      method: "POST",
                      body: new FormData(e.target),
                    });

                    if (response.ok) {
                      // Redirect the subscriber
                      window.open(
                        `${window.location.origin}/react-interview-questions-and-answers.pdf`,
                        "_blank"
                      );
                      setIsOpen(false)
                    } else {
                      // Something went wrong subscribing the user
                      alert("Sorry, we couldn't subscribe you.");
                    }
                  } catch (error) {
                    alert("Sorry, there was an issue: " + error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full bg-white rounded-xl focus:ring-4 focus:ring-offset-2 mt-4 font-semibold text-slate-800 focus:ring-purple-400 z-10 px-4 outline-none py-4 border-none"
                />

                <button
                  className="bg-purple-1 mx-auto w-fit !mt-10 rounded-full hover:-translate-y-1 cursor-pointer transform !border-0 focus:!outline-none !outline-none transition-all text-lg font-bold px-8 flex items-center gap-2 py-4"
                  primary
                >
                  {loading && (
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {loading ? 'Loading...' : 'Download now'}
                </button>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
