export default function TeamContainer({ children, title }) {
  return (
    <div className="my-20 px-28">
      <h4 className="font-serif mb-6 font-medium text-3xl text-center">{title}</h4>
      <div className="flex flex-wrap gap-14 justify-center">{children}</div>
    </div>
  );
}
