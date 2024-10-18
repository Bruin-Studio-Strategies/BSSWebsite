import ProcessCard from "../../../components/ProcessCard";

export default function Process() {
  return (
    <section className="w-full sm:w-4/5 mx-auto mb-48">
      <div className="flex flex-col gap-y-4">
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
          description="The final deliverable is completed and submitted to the client, concluding the project."
        />
      </div>
    </section>
  );
}
