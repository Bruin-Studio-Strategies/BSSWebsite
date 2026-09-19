import { motion, useReducedMotion } from "framer-motion";

import Timeline from "./sections/Timeline";
import FAQ from "./sections/FAQ";
import Footer from "../../components/Footer";
import SectionDivider from "../../components/SectionDivider";
import ApplyButton from "../../components/ApplyButton.jsx";
import SectionOpener from "../../components/SectionOpener.jsx";
import { APPLICATION_URL, CONTACT_EMAIL } from "../../content/site.js";
import { header, timeline, faq, closing } from "./content.js";
// PLACEHOLDER: standing in until there is a photograph from an actual info
// session or coffee chat, which is what a student deciding whether to apply
// most wants to see — the room they would be walking into. One-line swap.
import groupPhoto from "../../assets/optimized/group-1280.webp";

// Structure:
//   header (photo + the apply action)
//   recruitment timeline
//   FAQ
//   closing ask
//
// The landing page owns the 3D landscape and the clients page owns the
// engagement diagram; this page's character is photograph and printed
// programme, so it does not borrow either. The only ornament is Agatho at
// scale — the stage numerals — and everything else is a hairline rule.

export default function Recruitment() {
  const reduced = useReducedMotion();

  return (
    <>
      {/* Same measure and opener as every section below it, and as the clients
          page header. The apply action sits in the first viewport: a student who
          has already decided should not have to read a timeline to find the
          door. */}
      <header className="mx-auto mt-10 w-4/5 max-w-6xl sm:mt-16 md:grid md:grid-cols-[1fr_minmax(0,26rem)] md:items-center md:gap-x-12">
        <SectionOpener
          size="page"
          eyebrow={header.eyebrow}
          title={header.title}
          action={<ApplyButton className="mt-8" />}
        >
          {header.body}
        </SectionOpener>

        {/* The framed figure: brand-gradient bloom behind the photograph rather
            than a drop shadow beneath it — light comes from behind the object in
            this system. */}
        <div className="relative mt-12 md:mt-0">
          <motion.div
            aria-hidden="true"
            className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-sky/30 via-purple/20 to-magenta/30 blur-2xl"
            initial={{ opacity: 0.7 }}
            animate={reduced ? { opacity: 0.7 } : { opacity: [0.55, 0.8, 0.55] }}
            transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <img
            src={groupPhoto}
            alt="Bruin Studio Strategies members together on campus"
            className="relative aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-white/10"
          />
        </div>
      </header>

      <SectionDivider className="my-12 sm:my-16" />

      <section className="mx-auto w-4/5 max-w-6xl">
        <SectionOpener eyebrow={timeline.eyebrow} title={timeline.title} className="mb-12">
          {timeline.body}
        </SectionOpener>
        <Timeline />
      </section>

      <SectionDivider className="my-12 sm:my-16" />

      <section className="mx-auto w-4/5 max-w-6xl">
        <SectionOpener eyebrow={faq.eyebrow} title={faq.title} className="mb-10">
          {faq.body}
        </SectionOpener>
        <FAQ />
      </section>

      {/* Closing ask on the clients page's own template, so the bottom of both
          pages speaks the same language. The action here is a text link rather
          than a second magenta button — the header owns this page's one
          magenta.

          No rule of its own, unlike the clients and team pages' closing bands:
          the FAQ above already ends on one, and a second a section-gap below it
          read as a double rule with an empty strip between.

          The measure opens up at lg because the sentence is ~53rem set and the
          column is 72rem there — it lands on one line rather than breaking the
          email address off onto its own.

          Bottom margin clears the footer, which is position:absolute at a fixed
          height (h-60 below sm, h-24 from sm) rather than sitting in flow. */}
      <section className="mx-auto mb-72 mt-24 w-4/5 max-w-6xl sm:mb-44">
        <div>
          <SectionOpener
            eyebrow={closing.eyebrow}
            title={closing.title}
            measure="max-w-[34rem] lg:max-w-none"
          >
            {closing.lead}{" "}
            <a
              href={APPLICATION_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sky underline decoration-sky/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky"
            >
              {closing.applyLinkText}
            </a>
            {closing.betweenLinks}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sky underline decoration-sky/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            {closing.tail}
          </SectionOpener>
        </div>
      </section>

      <Footer />
    </>
  );
}
