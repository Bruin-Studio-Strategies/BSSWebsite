import Accordion from "../../../components/Accordion";
import { faq } from "../content.js";

// Just the stack. The section's opener lives in Recruitment.jsx with every other
// section opener on the page, so all of them share one measure and one alignment
// — previously this heading sat in a two-thirds column beside the questions,
// which gave the introduction twice the width of the content it introduced.
//
// The questions themselves are in `src/content/recruitment.json`; they used to
// be JSX children here, which meant editing one meant editing a component.
export default function FAQ() {
  return (
    <div>
      {faq.items.map((item) => (
        <Accordion key={item.question} title={item.question}>
          {item.answer}
        </Accordion>
      ))}
    </div>
  );
}
