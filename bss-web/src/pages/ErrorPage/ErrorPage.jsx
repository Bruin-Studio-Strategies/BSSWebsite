import Footer from "../../components/Footer";
import CtaButton from "../../components/CtaButton.jsx";

// Was two EB Garamond lines beside an 18rem numeral in a centred flex row, with
// a bg-blue-900 button — a stock blue, and the numeral alone was wider than a
// phone. Now it opens the way every other page does and the numeral is a
// clamp that can actually shrink.
export default function ErrorPage() {
  return (
    <>
      <section className="mx-auto mb-72 mt-16 w-4/5 max-w-6xl sm:mb-44 sm:mt-24">
        <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
          404
        </span>
        <h2 className="mt-4 font-display text-5xl leading-[1.05] text-white sm:text-6xl">
          Page not found
        </h2>
        <p className="mt-6 max-w-[42rem] font-sans text-base leading-relaxed text-white/70">
          That page has moved or never existed. Everything the site has is one
          click away in the navigation above.
        </p>
        <CtaButton to="/" className="mt-8">
          Back to home
        </CtaButton>
      </section>

      <Footer />
    </>
  );
}
