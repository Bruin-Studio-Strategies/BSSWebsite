import { Link } from "react-router-dom";

export default function NavItem({ className, path, children }) {
  return (
    <Link to={path} className={className}>
      <button
        className={`h-0 hover:text-blue-500 hover:underline mt-3 ml-16 text-sm text-white`}
      >
        {children}
      </button>
    </Link>
  );
}
