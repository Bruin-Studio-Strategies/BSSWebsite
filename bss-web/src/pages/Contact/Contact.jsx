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

function MailLink({ address, className = "" }) {
  return (
    <a
      href={`mailto:${address}`}
      className={`text-sky underline decoration-sky/30 underline-offset-4 transition-colors duration-200 hover:decoration-sky ${className}`}
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

          The address column and the form sit side by side rather than the form
          being the whole page: most people who open this already know which they
          want, and putting the general address in the first viewport means the
          ones who just want to email are not made to fill in a form first. */}
      <header className="mx-auto mt-10 w-4/5 max-w-6xl sm:mt-16">
        <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
          Contact
        </span>
        <h2 className="mt-4 max-w-[20ch] text-balance font-display text-5xl leading-[1.05] text-white sm:text-6xl">
          Interested in working with us?
        </h2>
        <p className="mt-6 max-w-[42rem] font-sans text-base leading-relaxed text-white/70">
          Whether you are a company, an organization, or a student on campus,
          we would love to hear from you.
        </p>
      </header>

      <section className="mx-auto mb-72 mt-14 grid w-4/5 max-w-6xl gap-x-16 gap-y-14 sm:mb-44 sm:mt-20 md:grid-cols-[minmax(0,24rem)_1fr]">
        <div>
          <h3 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            General
          </h3>
          {/* The one address that always works, set larger than the rest, because
              it is the right answer for almost everyone reading this page. */}
          <MailLink address={EMAIL} className="mt-3 block break-words text-lg sm:text-xl" />

          <h3 className="mt-12 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            By role
          </h3>
          <dl className="mt-4">
            {OFFICERS.map(({ role, emails }) => (
              <div key={role} className="border-t border-white/10 py-4 last:border-b">
                <dt className="font-sans text-sm text-white">{role}</dt>
                <dd className="mt-1.5 flex flex-col gap-1">
                  {emails.map((address) => (
                    <MailLink key={address} address={address} className="break-words text-sm" />
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:pl-4">
          <h3 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            Or send a message
          </h3>
          <div className="mt-6">
            <Form />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
