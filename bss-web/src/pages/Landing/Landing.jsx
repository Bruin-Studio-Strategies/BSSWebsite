import Title from "./sections/Title";
import Footer from "../../components/Footer";
import Info from "./sections/Info";
import Team from "./sections/Team";
import HeroBackdrop from "../../components/HeroScene/HeroBackdrop";
import SectionDivider from "../../components/SectionDivider";

export default function Landing() {
  return (
    <>
      {/* The 3D scene is not an intro that plays and then leaves — it is the
          background this part of the page is printed on. It stays pinned behind
          the hero copy and behind the section that follows, and the only thing
          that happens at the hand-off is the wireframe clearing off the dune's
          face, which leaves a bare dark surface for the copy to sit on.

          No overflow-hidden on this stage: an ancestor with clipped overflow
          becomes the scroll container for everything inside it, which silently
          breaks position:sticky for both the canvas and the hero copy. The sticky
          child clips its own contents instead. */}
      <div className="relative">
        {/* Pulled up 6rem so it runs behind the transparent navbar rather than
            starting underneath it; the content below cancels the shift with a
            matching pt-24. */}
        <div className="sticky top-0 h-screen overflow-hidden z-0 -mt-24" aria-hidden="true">
          <HeroBackdrop />
        </div>

        <div className="relative z-10 -mt-[100vh] pt-24">
          {/* Hero track: taller than one viewport so the sticky hero copy stays
              pinned while the sunset plays out. Height here (as a multiple of
              100vh) must match TEXT_TRACK_VH in useHeroScrollProgress. It is the
              copy's track, not the sunset's: the scene plays faster than the copy
              is allowed to leave. */}
          <div style={{ height: "160vh" }}>
            <div className="sticky top-24 h-screen">
              <Title />
            </div>
          </div>

          {/* The scroll the descent plays out over, and the thing that decides
              when the canvas stops being pinned.

              A sticky element releases when its bottom reaches its container's
              bottom, so this stage's height sets that moment: 100vh of canvas plus
              160vh of hero track plus this, minus the 100vh the canvas occupies,
              releases at (60 + this)vh. At 96 that is 156vh — exactly where the
              descent lands (EXIT_END_VH = 1.56). Lengthen the hero track and this
              shrinks by the same amount, or the release drifts off the landing.

              That matters more than it looks. While the canvas is pinned the dune
              is nailed to the viewport, so any copy scrolling over it slides across
              a frozen backdrop and reads as detached. The instant it releases, the
              canvas scrolls with the page at exactly the rate everything else does,
              and the copy below is fixed to the dune's face rather than moving
              across it. Info sits outside this stage for the same reason: inside it,
              the release point would depend on Info's own rendered height and land
              somewhere arbitrary in the middle of the section. */}
          <div aria-hidden="true" style={{ height: "96vh" }} />
        </div>
      </div>

      {/* Pulled up into the tail of the canvas so the copy climbs onto the dune's
          lower face rather than waiting in the gap below it. Without this there is
          most of a screen of nothing between the two: the canvas's bottom 38% is
          masked to transparent (see FADE_MASK in HeroBackdrop) and Info adds its own
          py-28 on top of that. The canvas has already released by here, so both
          scroll at the same rate and the copy stays fixed to the face it is on.

          The limit on this number: Info's top enters the viewport at (156 - this)vh
          and its copy about 11vh after that, while the canvas does not release until
          156vh. Past roughly -11 the copy is therefore on screen before the release,
          sliding over a dune still pinned to the viewport. At -45 that overlap is
          about a third of a screen. It is tolerable because the descent has all but
          landed by then and the face is flat and barely moving, but it is the thing
          that breaks if this is pushed much further — the copy starts sliding across
          a frozen backdrop again, which is the detachment this was fixing. */}
      <div className="relative -mt-[45vh]">
        <Info />
      </div>
      <SectionDivider className="my-4" />
      <Team />
      <Footer />
    </>
  );
}
