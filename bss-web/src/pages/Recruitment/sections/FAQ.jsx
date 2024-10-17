import Accordion from "../../../components/Accordion";

export default function FAQ() {
  return (
    <div className="px-4 pb-4 w-[95%] sm:w-[89%] mb-48 flex flex-col gap-y-6 mx-auto sm:mx-0">
      <Accordion title="What does BSS look for in an applicant?">
        We’re looking for students who are passionate about entertainment
        consulting and eager to learn. Whether you’re detail-oriented, a
        strategic thinker, or someone with a knack for analytics, we value
        candidates who are driven, collaborative, and ready to contribute to our
        team.
      </Accordion>
      <Accordion title="Do I need any experience to join?">
        No prior experience is necessary! We welcome students from all
        backgrounds and majors. Our training and hands-on project experience
        will equip you with the skills you need to succeed in entertainment
        consulting.
      </Accordion>
      <Accordion title="What will I be doing in the first quarter?">
        In your first quarter, you'll focus on building consulting fundamentals
        through resume workshops, case study training, and professional
        development sessions. You'll gain key skills to prepare you for future
        projects and success in the consulting field.
      </Accordion>
      <Accordion title="What will I gain from this experience?">
        By joining BSS, you’ll gain practical experience in entertainment
        consulting, develop a strong professional network, and sharpen valuable
        skills like problem-solving, teamwork, and communication. This hands-on
        experience will prepare you for future opportunities in the consulting
        and entertainment industries.
      </Accordion>
    </div>
  );
}
