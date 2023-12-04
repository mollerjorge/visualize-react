import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html className=" scroll-smooth" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Master React</title>
        <meta name="title" content="Master React" />
        <meta
          name="description"
          content="Empower Your Frontend Journey with 100+ Insightful Infographics for Crafting Exceptional Web Experiences!"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="react-infographics.georgemoller.com" />
        <meta property="og:title" content="Master React" />
        <meta
          property="og:description"
          content="Empower Your Frontend Journey with 100+ Insightful Infographics and 70+ video tutorials for Crafting Exceptional Web Experiences!"
        />

        <meta
          property="og:image"
          content="https://res.cloudinary.com/dptgkdbjg/image/upload/v1701652135/Frame_87_2_px9eki.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="master-react.georgemoller.com"
        />
        <meta property="twitter:title" content="100+ React Infographics" />
        <meta
          property="twitter:description"
          content="Empower Your Frontend Journey with 100+ Insightful Infographics for Crafting Exceptional Web Experiences!"
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/dptgkdbjg/image/upload/v1701652135/Frame_87_2_px9eki.png"
        />
        <Meta />
        <Links />
      </head>
      <body className=" tracking-wide bg-gradient-to-b from-body-1 to-body-2 text-white bg-no-repeat font-thiccboi antialiased">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
