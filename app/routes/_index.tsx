import { Hero } from "../components/Hero";
import { Header } from "../components/Header";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
