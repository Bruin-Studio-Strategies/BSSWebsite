import Footer from "../../components/Footer";
import Services from "./sections/Services";
import Process from "./sections/Process";
import board from "../../assets/board.jpg";
import SectionDivider from "../../components/SectionDivider";
import CtaButton from "../../components/CtaButton.jsx";
import SectionOpener from "../../components/SectionOpener.jsx";
export default function Clients() {
  return (
    <>
      {/* Page header on the same measure as every section below it. It used to be
          centred inside a full-width block while the rest of the page sat on
          w-4/5, which read as a different page grafted on top. Also retires EB
          Garamond here: display type is Agatho. */}
      <header className="mx-auto mt-10 w-4/5 max-w-6xl sm:mt-16">
        <SectionOpener size="page" eyebrow="For Clients" title="Work With BSS">
          Bruin Studio Strategies provides honed expertise across various
          sectors in the entertainment industry, supplying tailored consulting
          services for creative and business ventures.
        </SectionOpener>
      </header>
      {/* No divider between the header and Services: the services grid now opens
          with a hairline of its own on the first row of cells, so a rule here put
          two of them a heading apart. The margin does the separating. */}
      <div className="mt-20 sm:mt-24" />
      <Services />
      <SectionDivider className="my-12" />
      {/* Section opener, then the engagement's two fixed facts — duration and
          team shape — set beside it as a spec rather than stacked as loose
          sentences. With no metrics or case studies to point at, this concrete
          detail is the credibility the page has.

          Team shape reads as a second sentence rather than a floating spec
          box. Set beside the paragraph it left a hole on wide screens, and
          stacked under it, it was a labelled card holding six words. */}
      <SectionOpener
        eyebrow="How We Work"
        title="Project Process"
        className="mx-auto mb-14 w-4/5 max-w-6xl"
      >
        Throughout an 8-week timeframe, we can provide impactful deliverables
        to clients. Each project runs with 2 project managers and 4&ndash;5
        consultants.
      </SectionOpener>
      <Process />
      {/* Closing CTA as a ruled band on the schedule's own two-column template,
          so the bottom of the page speaks the same language as its middle.
          The ask is one complete block — eyebrow through button — rather than a
          headline on one side and its own sentence stranded on the other, which
          left ~500px of dead space between them. The photo takes the ruler
          column: present, but sized to support the ask instead of outweighing it
          the way a full-measure strip did. Squared corners and a hairline rather
          than the old soft rounded card, to match the rules above. The magenta
          button is the only magenta on this page.

          Bottom margin clears the footer, which is position:absolute at a fixed
          height (h-60 below sm, h-24 from sm) rather than sitting in flow. */}
      <section className="mx-auto mb-72 mt-28 w-4/5 max-w-6xl sm:mb-44">
        <div className="border-t border-white/15 pt-10 md:grid md:grid-cols-[1fr_minmax(0,26rem)] md:items-start md:gap-x-12">
          <SectionOpener
            eyebrow="Next Step"
            title="Get Started"
            measure="max-w-[34rem]"
            action={
              <CtaButton to="/contact" className="mt-7">
                Contact Us
              </CtaButton>
            }
          >
            Ready to receive our services? Email us at{" "}
            <a
              href="mailto:bruinstudiostrategies@gmail.com"
              className="text-sky underline decoration-sky/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky"
            >
              bruinstudiostrategies@gmail.com
            </a>{" "}
            or fill out our contact form.
          </SectionOpener>

          <img
            src={board}
            alt="Bruin Studio Strategies consultants on campus"
            className="mt-10 aspect-[3/2] w-full rounded-sm object-cover ring-1 ring-white/10 md:mt-0"
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
