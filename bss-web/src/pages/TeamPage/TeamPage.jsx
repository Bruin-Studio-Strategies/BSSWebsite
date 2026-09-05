import { EXECUTIVES, CONSULTANTS, ADVISORYBOARD } from "./people.js";

import Footer from "../../components/Footer.jsx";
import TeamCard from "../../components/TeamCard.jsx";
import TeamContainer from "../../components/TeamContainer.jsx";
import ApplyButton from "../../components/ApplyButton.jsx";

// `priority` marks the team that is on screen when the page opens. Its
// headshots are fetched immediately rather than lazily, so the first thing a
// visitor sees is photographs and not a grid of blurred placeholders.
const TEAMS = [
  { title: "Executives", people: EXECUTIVES, priority: true },
  { title: "Advisory Board", people: ADVISORYBOARD },
  { title: "Consultants", people: CONSULTANTS },
];

export default function TeamPage() {
  const headcount = TEAMS.reduce((total, team) => total + team.people.length, 0);

  return (
    <>
      {/* Same measure and left alignment as the Clients page header, so the two
          interior pages open the same way. */}
      <header className="mx-auto mt-10 w-4/5 max-w-6xl sm:mt-16">
        <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
          {headcount} Members
        </span>
        <h2 className="mt-4 font-display text-5xl leading-[1.05] text-white sm:text-6xl">
          Meet Our Team
        </h2>
        <p className="mt-6 max-w-[42rem] font-sans text-base leading-relaxed text-white/70">
          Diverse, passionate, and innovative. Our members study everything from
          film and music industry to statistics, engineering, and public
          affairs — and bring all of it to the work.
        </p>
      </header>

      {/* No SectionDivider between the header and the roster: every team below
          opens with its own ruled heading, so a divider here would be a second
          horizontal line stacked directly above the first. */}
      {TEAMS.map(({ title, people, priority }) => (
        <TeamContainer key={title} title={title} count={people.length}>
          {people.map((person) => (
            <TeamCard key={person.id} {...person} priority={priority} />
          ))}
        </TeamContainer>
      ))}

      {/* Closing ask, on the same ruled-band template as the Clients page CTA.
          Anyone who has just scrolled the whole roster is the exact person this
          is for. The magenta button is the only magenta on the page.

          Bottom margin clears the footer, which is position:absolute at a fixed
          height (h-60 below sm, h-24 from sm) rather than sitting in flow. */}
      <section className="mx-auto mb-72 mt-28 w-4/5 max-w-6xl sm:mb-44">
        <div className="border-t border-white/15 pt-10">
          <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
            Join Us
          </span>
          <h3 className="mt-4 text-balance font-display text-4xl leading-[1.1] text-white sm:text-5xl">
            Become a Bruin Studio Strategies Consultant
          </h3>
          {/* Two measures, because the same sentence wants different treatment at
              each. Below lg it is clamped to 29rem so the break lands on the em
              dash rather than mid-clause — the leading clause sets 455px in
              Inter 16/300, so 455–477px puts the break there, and text-pretty
              covers the fallback font. From lg the column is 72rem and the whole
              sentence sets in ~48rem, so it goes on one line; clamping it there
              only produces a break with nothing behind it. Same treatment as the
              closing line on /recruitment. */}
          <p className="mt-6 max-w-[29rem] text-pretty font-sans text-base leading-relaxed text-white/70 lg:max-w-none">
            We recruit UCLA students from every major and every year — no prior
            consulting experience required.
          </p>
          <ApplyButton className="mt-7" />
        </div>
      </section>

      <Footer />
    </>
  );
}
