import { FaCoffee, FaHandshake, FaRocket, FaClipboard } from "react-icons/fa";

import TimelineItem from "../../../components/TimelineItem";

export default function Timeline({ className }) {
  return (
    <ol className={"relative border-s-2 border-blue-800 " + className}>
      <TimelineItem
        title="Applications Open"
        time="October 7th, 2024"
        description="Submit your application and take the first step toward joining BSS, where you'll gain hands-on consulting experience in the entertainment industry."
        icon={<FaHandshake className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Information Session"
        time="October 15th, 2024"
        description="Learn more about BSS, meet current members, and get an inside look at what we do and how you can be part of the team."
        location="Online"
        attire="Casual"
        icon={<FaRocket className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Applications Due"
        time="October 18th, 2024"
        description="Be sure to complete and submit your application by this date to be considered for the next round of recruitment."
        icon={<FaRocket className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Coffee Chats (Invite Only)"
        time="October 22nd, 2024"
        description="An informal opportunity to chat with BSS members, learn about their experiences, and see if BSS is the right fit for you."
        location="Ackerman Patio"
        attire="Business Casual"
        icon={<FaCoffee className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Final Interviews (Invite Only)"
        time="October 25th, 2024"
        description="Selected candidates will participate in final interviews, showcasing their simple casing skills and passion for entertainment consulting. "
        location="Young Research Library"
        attire="Business Formal"
        icon={<FaClipboard className="fill-white h-6 w-6 block" />}
      />
    </ol>
  );
}
