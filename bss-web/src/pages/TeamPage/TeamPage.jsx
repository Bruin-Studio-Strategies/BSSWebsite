import { EXECUTIVES, CONSULTANTS, ADVISORYBOARD } from "./people.js";

import Footer from "../../components/Footer.jsx";
import TeamCard from "../../components/TeamCard.jsx";
import TeamContainer from "../../components/TeamContainer.jsx";
import ApplyButton from "../../components/ApplyButton.jsx";
import SectionOpener from "../../components/SectionOpener.jsx";
import { header, bands, closing } from "./content.js";

// `priority` marks the team that is on screen when the page opens. Its
// headshots are fetched immediately rather than lazily, so the first thing a
// visitor sees is photographs and not a grid of blurred placeholders.
//
// Which groups exist and which array feeds each one is structure; only the
// heading each one prints is copy, so the titles come from `bands` by key.
const TEAMS = [
  { title: bands.executives, people: EXECUTIVES, priority: true },
  { title: bands.advisoryBoard, people: ADVISORYBOARD },
  { title: bands.consultants, people: CONSULTANTS },
];

export default function TeamPage() {
  return (
    <>
      {/* Same measure and opener as the Clients page header, so the two
          interior pages open the same way. */}
      <header className="mx-auto mt-10 w-4/5 max-w-6xl sm:mt-16">
        {/* The body carries a non-breaking space before its em dash — see the
            note in content.js. */}
        <SectionOpener size="page" title={header.title}>
          {header.body}
        </SectionOpener>
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

          The lede has two measures, because the same sentence wants different
          treatment at each. Below lg it is clamped to 29rem so the break lands on
          the em dash rather than mid-clause — the leading clause sets 455px in
          Inter 16/300, so 455–477px puts the break there, and text-pretty covers
          the fallback font. From lg the column is 72rem and the whole sentence
          sets in ~48rem, so it goes on one line; clamping it there only produces
          a break with nothing behind it. Same treatment as the closing line on
          /recruitment.

          Bottom margin clears the footer, which is position:absolute at a fixed
          height (h-60 below sm, h-24 from sm) rather than sitting in flow. */}
      <section className="mx-auto mb-72 mt-28 w-4/5 max-w-6xl sm:mb-44">
        <div className="border-t border-white/15 pt-10">
          <SectionOpener
            eyebrow={closing.eyebrow}
            title={closing.title}
            titleClassName="text-balance"
            measure="max-w-[29rem] lg:max-w-none"
            ledeClassName="text-pretty"
            action={<ApplyButton className="mt-7" />}
          >
            {closing.body}
          </SectionOpener>
        </div>
      </section>

      <Footer />
    </>
  );
}
