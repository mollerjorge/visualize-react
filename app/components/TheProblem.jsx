import { clsx } from "clsx";
import book from "../images/book.webp";
import wallet from "../images/wallet.webp";
import rocket from "../images/rocket.webp";
import circle from "../images/circle-bg.webp";
import {
  useInView,
  animated,
  useSpring,
  config,
  useTransition,
} from "@react-spring/web";

const Card = ({ text, description, icon, alt, className }) => {
  return (
    <li className=" rounded-[32px] p-5 md:py-10 md:px-[30px] bg-bg-dark-1 lg:pt-40 relative">
      <img
        src={icon}
        alt={alt}
        className={clsx("lg:absolute -top-20 -left-0", className)}
      />
      <h3 className=" text-[28px] font-bold leading-tight mb-5">{text}</h3>
      {description}
    </li>
  );
};
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
  const [refShape, styles] = useInView(
    () => ({
      from: {
        opacity: 0,
        x: -30,
      },
      to: {
        opacity: 1,
        x: 0,
      },
    }),
    {
      rootMargin: "-40% 0%",
    }
  );
  return (
    <div id="overview" className="mb-20 overflow-hidden">
      <animated.img
        style={styles}
        ref={refShape}
        src={circle}
        alt="background circle"
        className="absolute left-0 w-[400px]"
      />
      <animated.div
        style={springs}
        ref={ref}
        className="flex pt-5 mx-auto max-w-4xl  flex-col"
      >
        <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium mx-auto">
          The problem
        </div>
        <h2 className=" text-[40px] mx-auto text-center font-bold">
          Building Clean, Well Organized React applications is hard.
        </h2>
        <div className="mx-5">
          <div className="max-w-[757px] font-medium text-lg mt-10 mx-auto">
            <ul className="mb-8 flex flex-col gap-2">
              <li>
                <span>1. </span>How to structure a React application?
              </li>
              <li>
                <span>2. </span>How to optimize components and avoid unneccesary
                renders?
              </li>
              <li>
                <span>3. </span>How and when to abstract your UI into
                components?
              </li>
              <li>
                <span>4. </span>How to apply engineering principles, like
                spearation of concerns to keep the business logic decoupled?
              </li>
              <li>
                <span>5. </span>How to apply engineering design patterns? (yes
                you can do this)
              </li>
            </ul>
            <p className="mb-8">
              These are some of the questions you might have found yourself
              asking in the past.
            </p>
            <p className="mb-8">
              I created{" "}
              <span className="text-purple-400 font-bold">
                107 beautifully designed infographics
              </span>
              , to explain these concepts (and more) in an easy-to-understand,
              visually appealing format.
            </p>
            <p className="mb-8">
              Complementing these infographics are{" "}
              <span className="text-purple-400 font-bold">
                77 dynamic video tutorials.{" "}
              </span>
              Each tutorial is crafted to guide you through practical,
              real-world scenarios in React development.
            </p>
            <p className="mb-10">You’ll get to:</p>
          </div>
        </div>
      </animated.div>
      <div className="mx-5 relative mb-10">
        <ul className="grid grid-cols-1 lg:grid-cols-3 mt-28 gap-10 max-w-7xl mx-auto">
          <Card
            text="Dive deep into professional secrets"
            description={
              <>
                <p className="text-lg font-medium mb-8">
                  Go beyond basic tutorials.
                </p>
                <p className="text-lg font-medium mb-8">
                  {" "}
                  The infographics and videos unveil key concepts and insider
                  tips used by top React JS professionals.
                </p>
              </>
            }
            alt="bookt icon"
            icon={book}
            className="w-32 md:w-48"
          />
          <Card
            text="Earn more money"
            description={
              <>
                <p className="mb-8">
                  It’s not just about learning; it’s about earning.
                </p>
                <p className="mb-8">
                  You will boost your potential to earn more.{" "}
                </p>
                <p className="mb-8">
                  Stand out in job interviews, negotiate higher salaries, and
                  attract lucrative project opportunities
                </p>
              </>
            }
            alt="wallet icon"
            icon={wallet}
            className="w-32 md:w-40"
          />
          <Card
            text="Skyrocket your performance"
            description={
              <>
                <p className="mb-8">
                  Dive straight into high-impact strategies that enhance the
                  performance of your React applications.{" "}
                </p>

                <p className="mb-8">
                  Learn how to fine-tune every aspect for maximum efficiency.
                </p>
              </>
            }
            alt="rocket icon"
            className="w-32 lg:!w-52"
            icon={rocket}
          />
        </ul>
        <div className=" left-0 right-0 h-[1500px] mx-auto bg-teal-300 rounded-full absolute bottom-0 filter blur-lg top-[200px] opacity-10 -z-[1]" />
      </div>
    </div>
  );
}
