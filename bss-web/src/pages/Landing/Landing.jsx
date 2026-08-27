import { motion } from "framer-motion";
import Title from "./sections/Title";
import Footer from "../../components/Footer";
import Info from "./sections/Info";
import Team from "./sections/Team";
import HeroBackdrop from "../../components/HeroScene/HeroBackdrop";



export default function Landing() {
  return (
    <>
      {/* Outer track: taller than one viewport so the sticky hero below stays
          pinned in place while the sunset animation plays out, only releasing to
          scroll away once the animation has actually finished. Height here (as a
          multiple of 100vh) must match TRACK_HEIGHT_VH in useHeroScrollProgress. */}
      <div className="relative" style={{ height: "160vh" }}>
        {/* No overflow-hidden here (unlike before this was split into a sticky
            wrapper) — it would clip the canvas's own -top-24 extension below,
            cutting off the part that's meant to bleed up behind the navbar and
            leaving the plain page background showing through instead (a color
            mismatch against the scene's own sky). The canvas div already clips
            its own content, so nothing here needs to double up on that. */}
        <div className="sticky top-24 h-screen">
          {/* Extends up behind the navbar (h-24) instead of starting below it, so
              the navbar's transparent background actually reveals the moving
              scene/glow instead of just the page's flat static gradient. */}
          <div className="absolute inset-x-0 -top-24 h-[calc(100%+6rem)] overflow-hidden z-0">
            <HeroBackdrop />
          </div>
          <Title />
        </div>
      </div>
      <Info />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto my-4 h-px w-11/12 max-w-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <Team />
      <Footer />
    </>
  );
}
