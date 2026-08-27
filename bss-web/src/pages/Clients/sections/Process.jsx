import ProcessTimeline from "../../../components/ProcessTimeline/ProcessTimeline.jsx";

export default function Process() {
  // Same w-4/5 measure as the heading block above it in Clients.jsx — the
  // schedule is part of that section, not a separately-centered island.
  return (
    <section className="mx-auto mb-32 w-4/5">
      <ProcessTimeline />
    </section>
  );
}
