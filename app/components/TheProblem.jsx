import {
  useInView,
  animated,
} from "@react-spring/web";

export default function TheProblem() {
  const [ref, springs] = useInView(
    () => ({
      from: {
        opacity: 0,
        y: 100,
      },
      to: {
        opacity: 1,
        y: 0,
      },
    }),
    {
      rootMargin: "-40% 0%",
    }
  );

  return (
    <div id="the-problem" className="py-20 overflow-hidden">
      <animated.div
        style={springs}
        ref={ref}
        className="max-w-4xl mx-auto px-5"
      >
        {/* AGITATE */}
        <div className="mb-16 bg-bg-dark-1 border border-light-1 rounded-[32px] p-8 md:p-12">
          <h3 className="text-[24px] md:text-[28px] font-bold text-center leading-tight mb-6 text-purple-2">
            Most React courses are slow paced. My videos are short, digestible, zero filler.
          </h3>
          <p className="text-lg font-medium text-center text-slate-300">
            Every lesson gets straight to the point. No 40-hour courses, no rambling intros. Just the React knowledge you need, explained visually so it sticks. Learn faster than with any traditional course.
          </p>
        </div>

        {/* SOLUTION */}
        <div className="text-center">
          <h3 className="text-[28px] md:text-[36px] font-bold leading-tight mb-6">
            Master React gives you the{" "}
            <span className="text-purple-2">mental models</span> that separate $80K devs from $200K devs.
          </h3>
          <p className="text-lg font-medium text-slate-300 max-w-3xl mx-auto">
            Not theory. Not 40-hour lectures. The actual decision frameworks senior developers use: when to reach for useEffect vs useLayoutEffect, how to structure folders that scale, why your re-renders are killing UX. Visual infographics that stick.{" "}
            <span className="text-white font-semibold">77 hands-on lessons. 107 visual challenges. Zero filler.</span>
          </p>
        </div>
      </animated.div>
    </div>
  );
}
