import Hero from "../../../components/Hero.jsx";
import { useHeroTextProgress } from "../../../hooks/useHeroScrollProgress.js";

export default function Title() {
  // The copy's own progress, not the sunset's: it stays pinned and fades over a
  // longer distance than the scene takes to play. See TEXT_TRACK_VH.
  const scrollYProgress = useHeroTextProgress();

  // Scroll-tied drift/fade lives inside Hero itself.
  return (
    <div className="sm:px-40 pt-10 sm:pt-28 lg:pt-40 w-full h-screen relative z-10">
      <Hero scrollYProgress={scrollYProgress} />
    </div>
  );
}
