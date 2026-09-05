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

      {/* Both columns hang off one rule rather than floating at their own heights,
          and both are bounded — left at 20rem, right at 36rem — so they sit as two
          columns of a page instead of smearing text across the full 72rem. 23rem
          on the left is measured, not picked: the general address is 31 characters
          and sets about 350px at text-xl, so a narrower column breaks it mid-address.
          The space between the columns is the point — this page has two answers,
          not one long one. */}
      <section className="relative mx-auto mb-72 mt-14 w-4/5 max-w-6xl sm:mb-44 sm:mt-20">
        {/* Atmosphere, not paint. Deep Iris only ever works as the layer things
            sit on — the same radial bloom that grounds the services grid and sits
            behind the framed photographs, placed here under the form so the right
            half of the page has a surface instead of being bare gradient. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -top-24 left-1/4 right-[-10%] -z-10 bg-[radial-gradient(55%_50%_at_60%_45%,rgba(82,55,148,0.38),transparent_70%)] blur-2xl"
        />

        <div className="grid gap-x-16 gap-y-14 border-t border-white/15 pt-10 md:grid-cols-[minmax(0,23rem)_minmax(0,34rem)] md:justify-between">
          <div>
            <ColumnHeading>Email us</ColumnHeading>
            {/* The one address that always works, and the second-loudest thing on
                the page after the headline — most people who open this already
                know they want to email, and should not have to find it. */}
            <MailLink
              address={EMAIL}
              className="mt-4 inline-block text-lg leading-snug decoration-sky/40 sm:text-xl"
            />

            <ColumnHeading className="mt-14">By role</ColumnHeading>
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
            <ColumnHeading>Or send a message</ColumnHeading>
            <div className="mt-6">
              <Form />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
