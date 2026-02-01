import React from "react";

const faqs = [
  {
    question: "How long does it take to complete?",
    answer: "Most developers finish in 2-3 weeks spending 30 min/day. But you'll start applying concepts immediately, often within the first hour."
  },
  {
    question: "I've been burned by courses before. How is this different?",
    answer: "Most courses are 40 hours of filler. This is 77 focused lessons averaging 5 minutes each. Every lesson teaches ONE concept with visual reinforcement. No theory lectures. No padding. If you can't apply it immediately, I cut it."
  },
  {
    question: "Is this too basic for me? I've been using React for 2+ years.",
    answer: "Most buyers are intermediate developers who know React basics but want to understand deeper patterns: when to use which hook, how to structure large apps, and performance optimization. If you've never questioned your architectural decisions, this will fill gaps you didn't know you had."
  },
  {
    question: "Is this too advanced? I'm just learning React.",
    answer: "You should be comfortable with React fundamentals (components, props, useState). This course won't teach you React from scratch. It teaches you how to write React professionally."
  },
  {
    question: "What if I don't like it?",
    answer: "Email me within 30 days for a full refund. No questions, no forms, no hoops. I've issued maybe 3 refunds total, but I want you to buy with zero risk."
  },
  {
    question: "Do I get lifetime access?",
    answer: "Yes. Pay once, access forever. Core and Premium tiers also include lifetime updates with new lessons added weekly."
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="border-b border-light-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left"
      >
        <span className="text-lg font-semibold pr-4">{question}</span>
        <span className={`text-purple-2 text-2xl transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="pb-6 text-slate-300 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="py-20 bg-body-1">
      <div className="max-w-3xl mx-auto px-5">
        <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium w-fit mx-auto">
          FAQ
        </div>
        <h2 className="text-[32px] md:text-[40px] font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="bg-bg-dark-1 border border-light-1 rounded-[32px] px-8 md:px-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}
