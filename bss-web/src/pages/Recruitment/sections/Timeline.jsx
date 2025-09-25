import {
  FaCoffee,
  FaEnvelopeOpen,
  FaClipboard,
  FaCalendar,
  FaInfoCircle
} from "react-icons/fa";

import TimelineItem from "../../../components/TimelineItem";

export default function Timeline({ className }) {
  return (
    <ol className={"relative border-s-2 border-blue-800 " + className}>
      <TimelineItem
        title="Applications Open"
        time="9/30"
        description="Submit your application and take the first step toward joining BSS, where you'll gain hands-on consulting experience in the entertainment industry."
        icon={<FaEnvelopeOpen className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Information Session"
        time="TBA"
        description="Learn more about BSS, meet current members, and get an inside look at what we do and how you can be part of the team."
        location="Online - Zoom"
        attire="Casual"
        icon={<FaInfoCircle className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Applications Due"
        time="10/10 (11:59 PM)"
        description="Be sure to complete and submit your application by this date to be considered for the next round of recruitment."
        icon={<FaCalendar className="fill-white h-6 w-6 block stroke-none  " />}
      />
      <TimelineItem
        title="Coffee Chats (Invite Only)"
        time="10/15"
        description="An informal opportunity to chat with BSS members, learn about their experiences, and see if BSS is the right fit for you."
        location="Kerckhoff Patio"
        attire="Business Casual"
        icon={<FaCoffee className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Final Interviews (Invite Only)"
        time="10/17 + 10/18"
        description="Selected candidates will participate in final interviews, showcasing their simple casing skills and passion for entertainment consulting. "
        attire="Business Formal"
        icon={<FaClipboard className="fill-white h-6 w-6 block" />}
      />
    </ol>
  );
}
