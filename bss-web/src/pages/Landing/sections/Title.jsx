import Hero from "../../../components/Hero.jsx";
import useHeroScrollProgress from "../../../hooks/useHeroScrollProgress.js";

export default function Title() {
  const scrollYProgress = useHeroScrollProgress();

  // Scroll-tied drift/fade lives inside Hero itself.
  return (
    <div className="sm:px-40 pt-10 sm:pt-28 lg:pt-40 w-full h-screen relative z-10">
      <Hero scrollYProgress={scrollYProgress} />
    </div>
  );
}
