import group from "../../../assets/IMG_9814.JPG";
import paramountLogo from "../../../assets/paramount.png"; // transparent Paramount logo

export default function Info() {
  return (
    <>
      {/* Existing BSS section */}
      <section className="mx-auto max-w-7xl px-8 sm:px-10 md:px-12 lg:px-20 xl:px-24 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 sm:gap-10 md:gap-12 xl:gap-16">
          
          {/* Left: heading + paragraph */}
          <div>
            <h3 className="font-serif text-center lg:text-left text-4xl sm:text-5xl lg:text-6xl mb-6 sm:mb-8">
              What is BSS?
            </h3>
            <p className="font-sans sm:font-serif text-base sm:text-2xl lg:text-3xl xl:text-[2rem] leading-relaxed sm:leading-relaxed lg:leading-9">
              Bruin Studio Strategies, UCLA’s first and premier entertainment consulting group,
              unites technical consulting fundamentals, technology, and Gen-Z insights to deliver
              actionable insights amidst the fast-paced and malleable entertainment ecosystems.
            </p>
          </div>

          {/* Right: image */}
          <div className="w-full">
            <img
              src={group}
              alt="Bruin Studio Strategies group photo"
              className="w-full h-auto rounded-md object-cover aspect-[4/3] md:aspect-[16/10] lg:aspect-[5/3] shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Paramount section */}
      <section className="mx-auto max-w-7xl px-8 sm:px-10 md:px-12 lg:px-20 xl:px-24 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 sm:gap-10 md:gap-12 xl:gap-16">
          
          {/* Left: Paramount logo */}
          <div className="flex justify-center">
            <img
              src={paramountLogo}
              alt="Paramount Pictures logo"
              className="w-48 sm:w-60 md:w-72 lg:w-96 h-auto"
            />
          </div>

          {/* Right: Quotation */}
          <div className="text-center lg:text-left text-white">
            <blockquote className="font-sans sm:font-serif text-lg sm:text-2xl lg:text-3xl xl:text-[2rem] italic leading-relaxed">
              “Partnering with the Bruin Studios Strategies group was a fantastic experience. 
              Their teams brought creativity, professionalism, and real passion to our case prompt, 
              delivering thoughtful and compelling presentations that reflected both hard work and 
              fresh ideas.”
              <br />
              <span className="not-italic font-semibold block mt-4">
                – Jonathon Kane, Manager, Business Development, Paramount Pictures (referring to Paramount x BSS Spring 2025 Case Competition)
              </span>
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
}
