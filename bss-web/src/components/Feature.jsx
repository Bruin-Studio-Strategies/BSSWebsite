export default function Feature({ className, title, description, icon }) {
  return (
    <div className={className + " flex"}>
      <div className="bg-purple p-3 rounded-full w-12 h-12 mr-5">{icon}</div>
      <div>
        <h2 className="font-serif text-2xl mb-2 font-medium text-white text-wrap">
          {title}
        </h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
