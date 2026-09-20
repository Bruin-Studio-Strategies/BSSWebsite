import Footer from "../../components/Footer";
import CtaButton from "../../components/CtaButton.jsx";
import SectionOpener from "../../components/SectionOpener.jsx";
import { NOT_FOUND } from "../../seo/siteMeta.js";

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
          eyebrow={NOT_FOUND.eyebrow}
          title={NOT_FOUND.title}
          action={
            <CtaButton to="/" className="mt-8">
              {NOT_FOUND.buttonLabel}
            </CtaButton>
          }
        >
          {NOT_FOUND.body}
        </SectionOpener>
      </section>

      <Footer />
    </>
  );
}
