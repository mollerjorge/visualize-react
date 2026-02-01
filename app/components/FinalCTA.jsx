import Button from "./Button";
import mixpanel from "mixpanel-browser";
import { track } from "@vercel/analytics";

export default function FinalCTA() {
  return (
    <div className="py-20 bg-body-1">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <h2 className="text-[32px] md:text-[48px] font-bold mb-6 leading-tight">
          Ready to <span className="text-purple-2">master React</span>?
        </h2>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          Or you could spend another month Googling the same patterns, second-guessing your architecture, and dreading code reviews. Your choice.
        </p>

        <div className="flex justify-center">
          <Button
            onClick={() => {
              track("Final CTA", { name: "Get Instant Access" });
              mixpanel.track("Click", {
                "Final CTA": "Get Instant Access",
              });
              if (typeof window !== 'undefined' && window.op) {
                window.op('track', 'cta_clicked', {
                  button_text: 'Get Instant Access $99',
                  location: 'final_cta',
                  cta_type: 'primary',
                  link_destination: '#pricing'
                });
              }
            }}
            to="#pricing"
            primary
          >
            Get Instant Access $99
          </Button>
        </div>

        <p className="text-sm text-slate-400 mt-4 flex items-center justify-center gap-2">
          <span>🛡️</span> 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
