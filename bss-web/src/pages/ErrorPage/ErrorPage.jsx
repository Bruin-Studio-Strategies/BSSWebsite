import Footer from "../../components/Footer";
import CtaButton from "../../components/CtaButton.jsx";
import SectionOpener from "../../components/SectionOpener.jsx";

// Was two EB Garamond lines beside an 18rem numeral in a centred flex row, with
// a bg-blue-900 button — a stock blue, and the numeral alone was wider than a
// phone. Now it opens the way every other page does and the numeral is a
// clamp that can actually shrink.
export default function ErrorPage() {
  return (
    <>
      <section className="mx-auto mb-72 mt-16 w-4/5 max-w-6xl sm:mb-44 sm:mt-24">
        <SectionOpener
          size="page"
          eyebrow="404"
          title="Page not found"
          action={
            <CtaButton to="/" className="mt-8">
              Back to home
            </CtaButton>
          }
        >
          That page has moved or never existed. Everything the site has is one
          click away in the navigation above.
        </SectionOpener>
      </section>

      <Footer />
    </>
  );
}
