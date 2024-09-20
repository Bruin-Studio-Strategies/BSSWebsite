export default function TeamContainer({ children, title }) {
  return (
    <div className="my-20 ml-48">
      <h4 className="font-serif mb-6 font-medium">{title}</h4>
      <div className="flex flex-wrap gap-14">{children}</div>
    </div>
  );
}
