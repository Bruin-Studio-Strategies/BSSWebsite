import Form from "./sections/Form";
import Footer from "../../components/Footer";

export default function Contact() {
  return (
    <>
      {/* add a banner here possibly? ask alli */}
      <div className="grid sm:grid-cols-[40%_60%] sm:mt-10 lg:mt-28 sm:max-lg:mb-40 w-10/12 m-auto text-center sm:text-left">
        <div className="flex flex-col mb-8 sm:mb-0">
          <h1 className="font-serif text-4xl mb-5 sm:text-5xl lg:text-7xl text-white font-medium text-wrap w-5/6 sm:mb-5 sm:mx-0 mx-auto">
            Interested in working with us?
          </h1>
          <p className="sm:mb-5 lg:text-lg mb-5">Whether you are a company, organization, or student on campus, we would love to get in touch with you</p>
          <p className="sm:mb-5 text-lg mb-5">bruinstudiostrategies@gmail.com</p>
          <p className="font-medium text-sm sm:text-base font-sans sm:mb-2 lg:text-lg mb-2">Co-Presidents: <br/><span className="font-light font-sans">awahab1@g.ucla.edu and Kiankazr@gmail.com</span></p>
          <p className="font-medium text-sm sm:text-base font-sans sm:mb-2 lg:text-lg mb-2">VP of External Affairs: <br/><span className="font-light font-sans">rianne.ke06@gmail.com</span></p>
          <p className="font-medium text-sm sm:text-base font-sans sm:mb-2 lg:text-lg mb-2">VPs of Internal Relations: <br/><span className="font-light font-sans">carlieharwood@g.ucla.edu and jyinghe07@g.ucla.edu</span></p>
        </div>
        <div className="flex justify-center sm:justify-start sm:ml-20 mb-80">
          <Form />
        </div>
      </div>
      <Footer />
    </>
  );
}
