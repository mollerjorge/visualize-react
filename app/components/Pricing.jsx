import Button from "./Button";

import mixpanel from "mixpanel-browser";
import { track } from "@vercel/analytics";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
      fill="#34D399"
    />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 0.25C4.615 0.25 0.25 4.615 0.25 10C0.25 15.385 4.615 19.75 10 19.75C15.385 19.75 19.75 15.385 19.75 10C19.75 4.615 15.385 0.25 10 0.25ZM7.53 7.53C7.67217 7.38783 7.86022 7.3157 8.05452 7.31912C8.24882 7.32255 8.43421 7.40127 8.57162 7.53868C8.70903 7.67609 8.78775 7.86148 8.79118 8.05578C8.7946 8.25008 8.72247 8.43813 8.58 8.58L9.17 10L8.58 11.42C8.72247 11.5619 8.7946 11.7499 8.79118 11.9442C8.78775 12.1385 8.70903 12.3239 8.57162 12.4613C8.43421 12.5987 8.24882 12.6775 8.05452 12.6809C7.86022 12.6843 7.67217 12.6122 7.53 12.47L6.11 11.05C5.96783 10.9078 5.8957 10.7198 5.89912 10.5255C5.90255 10.3312 5.98127 10.1458 6.11868 10.0084C6.25609 9.87097 6.44148 9.79225 6.63578 9.78882C6.83008 9.7854 7.01813 9.85753 7.16 10L7.53 10.37L7.16 10C7.01813 9.85753 6.83008 9.7854 6.63578 9.78882C6.44148 9.79225 6.25609 9.87097 6.11868 10.0084C5.98127 10.1458 5.90255 10.3312 5.89912 10.5255C5.8957 10.7198 5.96783 10.9078 6.11 11.05L7.53 12.47C7.67217 12.6122 7.86022 12.6843 8.05452 12.6809C8.24882 12.6775 8.43421 12.5987 8.57162 12.4613C8.70903 12.3239 8.78775 12.1385 8.79118 11.9442C8.7946 11.7499 8.72247 11.5619 8.58 11.42L9.17 10L8.58 8.58C8.72247 8.43813 8.7946 8.25008 8.79118 8.05578C8.78775 7.86148 8.70903 7.67609 8.57162 7.53868C8.43421 7.40127 8.24882 7.32255 8.05452 7.31912C7.86022 7.3157 7.67217 7.38783 7.53 7.53ZM12.47 7.53C12.3278 7.38783 12.1398 7.3157 11.9455 7.31912C11.7512 7.32255 11.5658 7.40127 11.4284 7.53868C11.291 7.67609 11.2122 7.86148 11.2088 8.05578C11.2054 8.25008 11.2775 8.43813 11.42 8.58L12.84 10L11.42 11.42C11.2775 11.5619 11.2054 11.7499 11.2088 11.9442C11.2122 12.1385 11.291 12.3239 11.4284 12.4613C11.5658 12.5987 11.7512 12.6775 11.9455 12.6809C12.1398 12.6843 12.3278 12.6122 12.47 12.47L13.89 11.05C14.0322 10.9078 14.1043 10.7198 14.1009 10.5255C14.0974 10.3312 14.0187 10.1458 13.8813 10.0084C13.7439 9.87097 13.5585 9.79225 13.3642 9.78882C13.1699 9.7854 12.9819 9.85753 12.84 10L12.47 10.37L12.84 10C12.9819 9.85753 13.1699 9.7854 13.3642 9.78882C13.5585 9.79225 13.7439 9.87097 13.8813 10.0084C14.0187 10.1458 14.0974 10.3312 14.1009 10.5255C14.1043 10.7198 14.0322 10.9078 13.89 11.05L12.47 12.47C12.3278 12.6122 12.1398 12.6843 11.9455 12.6809C11.7512 12.6775 11.5658 12.5987 11.4284 12.4613C11.291 12.3239 11.2122 12.1385 11.2088 11.9442C11.2054 11.7499 11.2775 11.5619 11.42 11.42L12.84 10L11.42 8.58C11.2775 8.43813 11.2054 8.25008 11.2088 8.05578C11.2122 7.86148 11.291 7.67609 11.4284 7.53868C11.5658 7.40127 11.7512 7.32255 11.9455 7.31912C12.1398 7.3157 12.3278 7.38783 12.47 7.53Z"
      fill="#6B7280"
    />
  </svg>
);

const Feature = ({ included, children }) => (
  <li className="flex items-center gap-3">
    {included ? <CheckIcon /> : <XIcon />}
    <span className={included ? "text-white" : "text-gray-500"}>{children}</span>
  </li>
);

const Pricings = [
  {
    tier: "basic",
    title: "Basic",
    price: "$29",
    fullPrice: "$59",
    discount: null,
    description: "For self-starters who learn by reading. Reference the visual infographics anytime you're stuck.",
    href: "https://georgemoller.lemonsqueezy.com/checkout/buy/185f28df-b087-4a7c-a7ac-c797fdbc14cf",
    features: [
      { name: "107 Visual Infographics", included: true },
      { name: "Interview Ebook", included: true },
      { name: "77 Video Lessons", included: false },
      { name: "Lifetime Updates", included: false },
      { name: "Walkthroughs of infographics", included: false },
      { name: "1hr React Consultation", included: false },
    ],
    cta: "Get Started $29",
    highlighted: false,
    badge: null,
  },
  {
    tier: "bundle",
    title: "Bundle",
    price: "$99",
    fullPrice: "$149",
    discount: null,
    description: "The fast track to senior-level React. Video walkthroughs + visual references + weekly updates.",
    href: "https://georgemoller.lemonsqueezy.com/checkout/buy/992390e3-36f8-4ee7-8200-2ba781004206",
    features: [
      { name: "+77 Video Lessons", included: true },
      { name: "+107 Visual Infographics", included: true },
      { name: "Interview Ebook", included: true },
      { name: "Lifetime Updates", included: true },
      { name: "Walkthroughs of infographics", included: false },
      { name: "1hr React Consultation", included: false },
    ],
    cta: "Enroll Now",
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    tier: "premium",
    title: "Premium",
    price: "$169",
    fullPrice: "$249",
    discount: null,
    description: "Everything in Bundle + Walkthroughs of infographics + 1hr consultation.",
    href: "https://georgemoller.lemonsqueezy.com/checkout/buy/601f46d6-3f75-4ab8-8ae1-70a5f1006c50",
    features: [
      { name: "+77 Video Lessons", included: true },
      { name: "+107 Visual Infographics", included: true },
      { name: "Interview Ebook", included: true },
      { name: "Lifetime Updates", included: true },
      { name: "Walkthroughs of infographics", included: true },
      { name: "1hr React Consultation", included: true },
    ],
    cta: "Go Premium $169",
    highlighted: false,
    badge: null,
  },
];

export default function Pricing() {
  return (
    <div className="py-40 bg-body-1">
      <div className="max-w-7xl mx-auto px-5">
        <div className="max-w-max mx-auto bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium">
          Pricing
        </div>

        <h2
          id="pricing"
          className="max-w-max mx-auto text-[32px] md:text-[40px] text-center leading-tight font-bold"
        >
          Choose Your Package
        </h2>
        <p className="max-w-lg mx-auto text-lg text-center mt-4 text-slate-300">
          Pay once. Access forever. Core and Premium include lifetime updates, new lessons added weekly.
        </p>

        <ul className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 mt-20 gap-8 relative justify-items-center">
          {Pricings.map((pricing, index) => {
            const isHighlighted = pricing.highlighted;
            return (
              <li
                key={pricing.tier}
                className={`
                  relative z-10 rounded-[32px] border px-8 py-8 w-full max-w-[360px] flex justify-between flex-col
                  ${isHighlighted
                    ? "border-purple-2 bg-purple-2 bg-opacity-10 scale-105 lg:scale-110"
                    : "border-light-1 bg-slate-800"
                  }
                `}
              >
                {pricing.badge && (
                  <div className={`
                    absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold z-10
                    ${isHighlighted ? "bg-purple-2 text-white" : "bg-slate-700 text-slate-300"}
                  `}>
                    {pricing.badge}
                  </div>
                )}

                <div className="flex flex-col relative z-10">
                  <h3 className="text-[25px] font-bold mb-2 leading-tight">
                    {pricing.title}
                  </h3>

                  <p className="text-slate-400 text-sm mb-6 min-h-[60px]">
                    {pricing.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-4xl">{pricing.price}</span>
                    <span className="text-xl text-slate-500 line-through">{pricing.fullPrice}</span>
                  </div>

                  {pricing.discount && (
                    <div className="border-purple-2 border rounded-full text-center font-bold text-xs py-1 px-3 w-fit bg-purple-2 bg-opacity-10 mb-6">
                      {pricing.discount}
                    </div>
                  )}

                  <div className="h-[1px] w-full bg-white bg-opacity-10 mb-6" />

                  <ul className="flex flex-col gap-3 mb-8">
                    {pricing.features.map((feature) => (
                      <Feature key={feature.name} included={feature.included}>
                        {feature.name}
                      </Feature>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10">
                  <Button
                    onClick={() => {
                      track("Pricing CTA", { tier: pricing.tier });
                      mixpanel.track("Click", {
                        "Pricing CTA": pricing.tier,
                      });
                      if (typeof window !== 'undefined' && window.op) {
                        window.op('track', 'pricing_cta_clicked', {
                          pricing_tier: pricing.tier,
                          tier_price: pricing.price,
                          tier_position: index + 1,
                          button_text: pricing.cta,
                          location: 'pricing',
                          discount_percentage: pricing.discount
                        });
                      }
                    }}
                    to={pricing.href}
                    primary={isHighlighted}
                    full
                  >
                    {pricing.cta}
                  </Button>

                  <p className="text-center text-sm text-slate-400 mt-3 flex items-center justify-center gap-2">
                    <span>🛡️</span> 30-day guarantee
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}
