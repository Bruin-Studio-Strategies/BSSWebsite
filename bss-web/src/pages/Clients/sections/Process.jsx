import ProcessCard from "../../../components/ProcessCard";
import ProcessLogoScene from "../../../components/ProcessLogoScene/ProcessLogoScene.jsx";
import useSectionScrollProgress from "../../../hooks/useSectionScrollProgress.js";

export default function Process() {
  const { trackRef, pinnedRef, progress } = useSectionScrollProgress();

  return (
    <section className="w-full sm:w-4/5 mx-auto mb-48">
      <div ref={trackRef} className="grid grid-cols-1 md:grid-cols-2 items-start gap-x-12 gap-y-10">
        {/* Pinned build scene: assembles across the same scroll range this card
            list occupies, so it stays visually tied to "where you are" in the
            process rather than playing out on its own timeline. */}
        <div ref={pinnedRef} className="order-1 md:order-2 sticky top-24 h-[45vh] md:h-[60vh]">
          <ProcessLogoScene progress={progress} />
        </div>
        <div className="flex flex-col gap-y-4 order-2 md:order-1">
          <ProcessCard
            title="Project Kickoff"
            period="Week 0"
            description="The project officially begins with the creation and approval of the Statement of Work. The contract is finalized with the client and an initial kickoff call is scheduled with the project team to align expectations and goals."
          />
          <ProcessCard
            title="Research and Analysis"
            period="Weeks 1 to 4"
            description="The team conducts extensive research and analysis to gather critical data and insights. A slide deck is also created to present these findings as well as the project process"
          />
          <ProcessCard
            title="Midterm Deliverable"
            period="Week 4"
            description="At the mid-point of the project, a deliverable is shared with the client. This is an opportunity to adjust the course of the project and get feedback on the project if needed."
          />
          <ProcessCard
            title="Additional Research and Refinements"
            period="Weeks 5 to 9"
            description="Based on client feedback from the midterm deliverable, additional refinements and research are made to fine-tune the deliverables to implement the client's needs"
          />
          <ProcessCard
            title="Final Deliverable"
            period="Week 9"
            description="The final deliverable is completed and submitted to the client, concluding the project. The team will answer any questions and provide support as needed."
          />
        </div>
      </div>
    </section>
  );
}
