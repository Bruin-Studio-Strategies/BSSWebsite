import { Link } from "react-router-dom";

export default function NavItem({ className, path, children }) {
  return (
    <Link to={path} className={className}>
      <button
        className={`h-0 hover:text-blue-500 hover:underline sm:text-sm sm:mb-2 sm:ml-2 lg:mb-5 lg:ml-5 lg:text-xl text-white`}
      >
        {children}
      </button>
    </Link>
  );
}
