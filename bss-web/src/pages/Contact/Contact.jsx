import Form from "./sections/Form";
import Footer from "../../components/Footer";

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
function ColumnHeading({ children, className = "" }) {
  return (
    <h3
      className={`font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-sky ${className}`}
    >
      {children}
    </h3>
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
          old site that had been left behind. */}
      <header className="mx-auto mt-10 w-4/5 max-w-6xl sm:mt-16">
        <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
          Contact
        </span>
        {/* Balanced below lg, one line from lg up: at 3.75rem Agatho the whole
            question sets in about 50rem and the column is 72rem there, so the
            20ch clamp was breaking a line that had room to stay whole. */}
        <h2 className="mt-4 max-w-[20ch] text-balance font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:max-w-none">
          Interested in working with us?
        </h2>
        <p className="mt-6 max-w-[42rem] font-sans text-base leading-relaxed text-white/70">
          Whether you are a company, an organization, or a student on campus,
          we would love to hear from you.
        </p>
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
          leading without needing to come first. 23rem and 34rem: the general
          address is 31 characters and sets about 350px at text-xl, so a narrower
          left column would break it mid-address. */}
      <section className="relative mx-auto mb-72 mt-14 w-4/5 max-w-6xl sm:mb-44 sm:mt-20">
        {/* Atmosphere, not paint. Deep Iris only ever works as the layer things
            sit on — the same radial bloom that grounds the services grid and sits
            behind the framed photographs, placed under the form so the page has a
            surface where the reader is actually working. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -top-24 left-1/3 right-[-10%] -z-10 bg-[radial-gradient(55%_50%_at_55%_45%,rgba(82,55,148,0.38),transparent_70%)] blur-2xl"
        />

        <div className="grid gap-x-16 gap-y-16 border-t border-white/15 pt-10 md:grid-cols-[minmax(0,23rem)_minmax(0,34rem)] md:justify-between">
          <div>
            <p className="font-sans text-base leading-relaxed text-white/70">
              Email us directly at
            </p>
            {/* text-base below sm, not text-lg: the container is `w-4/5`, so on a
                320px phone it is 256px wide and this 31-character address sets
                about 273px at 18px — it would have pushed the page sideways.
                `break-words` is the safety net under that, not the plan. */}
            <MailLink
              address={EMAIL}
              className="mt-2 inline-block break-words text-base leading-snug decoration-sky/40 sm:text-xl"
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
            <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">
              Or send a message
            </h3>
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
