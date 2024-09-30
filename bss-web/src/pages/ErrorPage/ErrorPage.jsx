import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <NavBar />
      <div className="flex gap-x-10 justify-center sm:mb-48">
        <h1 className="font-serif text-[18rem] text-white">404</h1>
        <div className="flex flex-col justify-center align-middle gap-y-10 mr-20">
          <h3 className="text-3xl font-serif">Page Not Found</h3>
          <Link to="/">
            <button className="text-white bg-blue-900 hover:bg-blue-800 rounded-sm p-2">
              Go to the homepage
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
