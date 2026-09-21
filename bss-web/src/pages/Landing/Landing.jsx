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
              100vh) must match TEXT_TRACK_VH in useHeroScrollProgress, and cannot
              go below 256vh without clamping the descent's window short (the
              reasoning is on TEXT_TRACK_VH). It is the
              copy's track, not the sunset's: the scene plays faster than the copy
              is allowed to leave. */}
          <div style={{ height: "260vh" }}>
            <div className="sticky top-24 h-screen">
              <Title />
            </div>
          </div>

          {/* The scroll the descent plays out over, and the thing that decides
              when the canvas stops being pinned.

              A sticky element releases when its bottom reaches its container's
              bottom, so this stage's height sets that moment: 100vh of canvas plus
              260vh of hero track plus this, minus the 100vh the canvas occupies,
              releases at (160 + this)vh. It is 0 now: the hero copy's track grew
              long enough to carry the release on its own, and the descent's window
              was moved to land at 160vh instead (EXIT_END_VH is derived from the
              track in useHeroScrollProgress). Kept, at zero, because shortening
              the hero track again means this has to take the difference back.

              That matters more than it looks. While the canvas is pinned the dune
              is nailed to the viewport, so any copy scrolling over it slides across
              a frozen backdrop and reads as detached. The instant it releases, the
              canvas scrolls with the page at exactly the rate everything else does,
              and the copy below is fixed to the dune's face rather than moving
              across it. Info sits outside this stage for the same reason: inside it,
              the release point would depend on Info's own rendered height and land
              somewhere arbitrary in the middle of the section. */}
          <div aria-hidden="true" style={{ height: "0vh" }} />
        </div>
      </div>

      {/* Pulled up into the tail of the canvas so the copy climbs onto the dune's
          lower face rather than waiting in the gap below it. Without this there is
          most of a screen of nothing between the two: the canvas's bottom 38% is
          masked to transparent (see FADE_MASK in HeroBackdrop) and Info adds its own
          py-28 on top of that. The canvas has already released by here, so both
          scroll at the same rate and the copy stays fixed to the face it is on.

          How much of the canvas this covers is arithmetic, not taste. The canvas
          is one viewport tall and, once released, sits with its bottom on the
          stage's bottom — which is where Info's top would be at a pull of 0. So
          the band of released canvas above Info is (100 - this)vh whatever the
          hero track's length is, since lengthening the track moves the release
          point and Info's top by the same amount. At -45 that band was 55vh of
          landed, cleared, unlit dune with nothing printed on it, arriving just as
          the headline finished fading — the blank block between the hero and the
          section.

          The other limit is the one this used to be written against: Info's copy
          must not arrive before the descent does, or it slides across a dune that
          is pinned and no longer moving. Its copy enters the viewport at
          (260 - this + 11 - 100)vh and the descent runs from 44vh to 160vh, so
          anything up to about -110 keeps that arrival inside the descent. At -80
          it enters at 91vh, two fifths of the way through. */}
      <div className="relative -mt-[80vh]">
        <Info />
      </div>
      <SectionDivider className="my-4" />
      <Team />
      <Footer />
    </>
  );
}
