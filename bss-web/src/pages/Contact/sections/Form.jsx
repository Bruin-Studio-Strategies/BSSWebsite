import { useState } from "react";
import emailjs from "emailjs-com";

import CtaButton from "../../../components/CtaButton.jsx";

const EMAIL = "bruinstudiostrategies@gmail.com";

// Ruled fields, not boxes. A bordered input is the one shape this design system
// does not have anywhere else — the timeline spine, the service cells and the
// section dividers are all single hairlines, so a field is a line you write on
// and the line lights up when you are on it.
const FIELD =
  "w-full border-b border-white/20 bg-transparent pb-2 pt-1 font-sans text-base text-white outline-none transition-colors duration-200 placeholder:text-white/30 focus:border-sky";

const LABEL =
  "block font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/50";

const EMPTY = { name: "", email: "", message: "" };

export default function Form() {
  const [formData, setFormData] = useState(EMPTY);
  // "idle" | "sending" | "sent" | "error". The old version set a success message
  // the moment submit was pressed and logged failures to the console, so a send
  // that never arrived still told the visitor it had.
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    try {
      await emailjs.send(
        import.meta.env.VITE_SERVICE_ID,
        "template_evjz5eh",
        formData,
        "g14fCrHcyIeM5ObMM"
      );
      setFormData(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const label =
    status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Send message";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <label htmlFor="name" className={LABEL}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-3 ${FIELD}`}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className={LABEL}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-3 ${FIELD}`}
          required
        />
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className={`mt-3 resize-y ${FIELD}`}
          required
        />
      </div>

      <div>
        <CtaButton type="submit" disabled={status === "sending"}>
          {label}
        </CtaButton>

        {/* The outcome sits under the control that caused it, and a failure says
            what to do instead rather than only that something went wrong. */}
        <p className="mt-4 min-h-[1.25rem] font-sans text-sm" role="status" aria-live="polite">
          {status === "sent" && (
            <span className="text-white/70">
              Thanks — we&apos;ll get back to you shortly.
            </span>
          )}
          {status === "error" && (
            <span className="text-white/70">
              That didn&apos;t send. Email us at{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="text-sky underline decoration-sky/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky"
              >
                {EMAIL}
              </a>{" "}
              instead.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
