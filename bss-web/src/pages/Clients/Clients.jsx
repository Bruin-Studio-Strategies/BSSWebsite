import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Services from "./sections/Services";
import Process from "./sections/Process";
import { Link } from "react-router-dom";
import board from "../../assets/board.jpg";
export default function Clients() {
  return (
    <>
      <div className="flex flex-col items-center mt-5 sm:mt-10">
        <h2 className="font-serif text-4xl sm:text-5xl text-white text-center tracking-wider">
          Work With BSS
        </h2>
        <p className="text-center text-wrap w-5/6 sm:w-1/2 mt-5 font-sans sm:text-base text-sm">
          Bruin Studio Strategies provides honed expertise across various
          sectors in the entertainment industry, supplying tailored consulting
          services for creative and business ventures.
        </p>
      </div>
      <hr className="h-px my-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <Services />
      <hr className="h-px my-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      {/* Section opener, then the engagement's two fixed facts — duration and
          team shape — set beside it as a spec rather than stacked as loose
          sentences. With no metrics or case studies to point at, this concrete
          detail is the credibility the page has. */}
      <div className="mx-auto mb-14 w-4/5 max-w-6xl">
        <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
          How We Work
        </span>
        <h3 className="mt-4 font-display text-4xl leading-[1.1] text-white sm:text-5xl">
          Project Process
        </h3>
        {/* Team shape reads as a second sentence rather than a floating spec
            box. Set beside the paragraph it left a hole on wide screens, and
            stacked under it, it was a labelled card holding six words. */}
        <p className="mt-6 max-w-[42rem] font-sans text-base leading-relaxed text-white/70">
          Throughout an 8-week timeframe, we can provide impactful deliverables
          to clients. Each project runs with 2 project managers and 4&ndash;5
          consultants.
        </p>
      </div>
      <Process />
      {/* Closing CTA. The magenta button is the only magenta on this page — it
          is the one action the whole page is asking for. */}
      <div className="mx-auto mb-32 mt-24 grid w-4/5 max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
            Next Step
          </span>
          <h3 className="mt-4 font-display text-4xl leading-[1.1] text-white sm:text-5xl">
            Get Started
          </h3>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/70">
            Ready to receive our services? Email us at{" "}
            <a
              href="mailto:bruinstudiostrategies@gmail.com"
              className="text-sky underline decoration-sky/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky"
            >
              bruinstudiostrategies@gmail.com
            </a>{" "}
            or fill out our contact form.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center rounded-sm bg-magenta px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wide text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-magenta/80 hover:shadow-lg hover:shadow-magenta/30 active:translate-y-0 active:shadow-none"
          >
            Contact Us
          </Link>
        </div>
        <img
          src={board}
          alt="Bruin Studio Strategies consultants working with a client team"
          className="w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
        />
      </div>
      <Footer />
    </>
  );
}
