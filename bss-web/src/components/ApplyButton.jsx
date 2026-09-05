import CtaButton from "./CtaButton.jsx";
import { APPLICATION_URL } from "../applyLink.js";

// Every "Apply Now" on the site renders through here: one treatment, one
// destination. Before this there were five call sites carrying four different
// treatments and three different form links.
//
// It is a thin wrapper rather than its own button because the apply control is
// not visually special — it is the site's CtaButton pointed at the application
// form. What this component owns is the link and the label, nothing else.
export default function ApplyButton({
  variant = "solid",
  className = "",
  onClick,
  children = "Apply Now",
}) {
  return (
    <CtaButton
      href={APPLICATION_URL}
      variant={variant}
      className={className}
      onClick={onClick}
    >
      {children}
    </CtaButton>
  );
}
