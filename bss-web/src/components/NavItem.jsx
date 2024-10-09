import { Link } from "react-router-dom";

export default function NavItem({ className, path, children, onClick }) {
  return (
    <Link to={path} className={className}>
      <button
        className={`h-0 hover:text-blue-500 inline-block hover:underline text-sm mb-10 lg:text-xl text-white ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </Link>
  );
}
