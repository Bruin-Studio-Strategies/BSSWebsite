import Form from "./sections/Form";
import Footer from "../../components/Footer";
import SectionOpener from "../../components/SectionOpener.jsx";

const EMAIL = "bruinstudiostrategies@gmail.com";

// Roles rather than names, because the roster turns over every year and this list
// would go stale a name at a time. A role with two holders keeps both addresses on
// one row instead of becoming two rows that look like two different jobs.
const OFFICERS = [
  { role: "Co-Presidents", emails: ["awahab1@g.ucla.edu", "Kiankazr@gmail.com"] },
  { role: "VP of External Affairs", emails: ["rianne.ke06@gmail.com"] },
  {
    role: "VPs of Internal Relations",
    emails: ["carlieharwood@g.ucla.edu", "jyinghe07@g.ucla.edu"],
  },
];

// The Label token, which is Instrument Sky — not white at an opacity. Setting
// these in white/50 is what made the page read as grey: with the headline in
// Agatho and everything else white-on-gradient, sky had nowhere to do its job of
// naming the structure.
//
// An h2, like the form's "Or send a message": the address column and the form are
// peer sections directly under the page's h1. It was an h3, and because the
// address column comes first in the markup the outline dropped from h1 straight
// to h3 before reaching the form's h2.
function ColumnHeading({ children, className = "" }) {
  return (
    <h2
      className={`font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-sky ${className}`}
    >
      {children}
    </h2>
  );
}

// Always font-sans. An address is information, not a statement — Agatho is a
// high-contrast display serif and an email set in it, full of @ and dots and
// lowercase, looks like a mistake.
function MailLink({ address, className = "" }) {
  return (
    <a
      href={`mailto:${address}`}
      className={`font-sans text-white underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-sky hover:decoration-sky ${className}`}
    >
      {address}
    </a>
  );
}

export default function Contact() {
  return (
    <>
      {/* Same measure, alignment and opener as every other page. This one was
          centred above sm and left-aligned below it, on a `w-10/12` grid nothing
          else uses, with the headline in EB Garamond — it read as a page from the
          old site that had been left behind.

          The headline sets on one line from lg up: at 3.75rem Agatho the whole
          question sets in about 50rem and the column is 72rem there, so a tight
          clamp was breaking a line that had room to stay whole. Below that the
          wrap is driven by type size rather than by this measure: on a 390px
          phone the column is 312px and the question breaks at the page
          headline's phone size, the same size every other page opens at. Do not
          shrink this one on its own to change the break — it would make this
          page's headline quieter than the rest. */}
      <header className="mx-auto mt-10 w-4/5 max-w-6xl sm:mt-16">
        <SectionOpener
          size="page"
          eyebrow="Contact"
          title="Interested in working with us?"
          titleClassName="max-w-[26ch] text-balance lg:max-w-none"
        >
          Whether you are a company, an organization, or a student on campus,
          we would love to hear from you.
        </SectionOpener>
      </header>

      {/* The two ways of reaching the club were previously the same weight — a sky
          micro-label over each column, two of them on the left against one on the
          right — so neither led and the page asked the reader to choose before
          telling them anything. They are now different *kinds* of thing rather
          than two of a kind: the form is the page's function and carries an Agatho
          subhead, and the addresses are the aside beside it, opening with a line
          of body copy rather than a competing heading.

          The addresses stay on the left, where they read first; the form is the
          wider column and carries the Agatho subhead, which is what keeps it
          leading without needing to come first.

          The aside is a fixed 22rem and the form takes the rest, rather than both
          being fixed and pushed apart with `justify-between` — that left about
          200px of dead space in the middle of the page at desktop, which read as
          two unrelated blocks rather than one spread. 22rem is still wide enough
          that the 31-character address does not break. */}
      <section className="relative mx-auto mb-72 mt-14 w-4/5 max-w-6xl sm:mb-44 sm:mt-20">
        {/* Atmosphere, not paint. Deep Iris only ever works as the layer things
            sit on — the same radial bloom that grounds the services grid and sits
            behind the framed photographs, placed under the form so the page has a
            surface where the reader is actually working. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -top-32 left-0 right-[-15%] -z-10 bg-[radial-gradient(70%_65%_at_62%_45%,rgba(82,55,148,0.55),transparent_72%)] blur-3xl"
        />

        <div className="grid gap-x-20 gap-y-16 border-t border-white/15 pt-10 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div>
            <p className="font-sans text-sm leading-relaxed text-white/70 sm:text-base">
              Email us directly at
            </p>
            {/* Body size below sm, not text-lg: the container is `w-4/5`, so on a
                320px phone it is 256px wide and this 31-character address sets
                about 273px at 18px — it would have pushed the page sideways.
                `break-words` is the safety net under that, not the plan. */}
            <MailLink
              address={EMAIL}
              className="mt-2 inline-block break-words text-sm leading-snug decoration-sky/40 sm:text-xl"
            />

            <ColumnHeading className="mt-12">By role</ColumnHeading>
            <dl className="mt-4">
              {OFFICERS.map(({ role, emails }) => (
                <div key={role} className="border-t border-white/10 py-4 last:border-b">
                  <dt className="font-sans text-sm text-white/70">{role}</dt>
                  <dd className="mt-1.5 flex flex-col gap-1">
                    {emails.map((address) => (
                      <MailLink key={address} address={address} className="text-sm" />
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            {/* h2, directly under the page's h1 — it was an h3, which skipped a
                level in the outline. */}
            <h2 className="font-display text-xl leading-tight text-white sm:text-2xl md:text-3xl">
              Or send a message
            </h2>
            <div className="mt-8">
              <Form />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
